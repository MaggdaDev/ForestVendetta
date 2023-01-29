
const LoginMongoAccessor = require("../mongo/loginMongoAccessor");
const LoginRabbitCommunicator = require("../rabbit/loginRabbitCommunicator");
const DiscordAPIAccessor = require("./dicordApiAccessor");
const DiscordAuthenticator = require("./discordAuthenticator");

class RequestHandler {
    /**
     * 
     * @param {DiscordAPIAccessor} discordApiAccessor 
     * @param {LoginMongoAccessor} mongoAccessor
     */

    // errors
    static ERRORS = {
        DISCORD_API_FAIL: "DISCORD_API_FAIL",
        INVALID_SESSION: "INVALID_SESSION",
        INVALID_LINK: "INVALID_LINK",
        MONGO_FAIL: "MONGO_FAIL",
        INVALID_PARAMS: "INVALID_PARAMS",
        NOT_AUTHENTICATED: "NOT_AUTHENTICATED"
    }
    /**
     * 
     * @param {DiscordAPIAccessor} discordApiAccessor 
     * @param {DiscordAuthenticator} discordAuthenticator
     * @param {LoginMongoAccessor} mongoAccessor 
     * @param {LoginRabbitCommunicator} rabbitCommunicator
     * @param {Object} adressManager 
     */
    constructor(discordApiAccessor, discordAuthenticator, mongoAccessor, rabbitCommunicator, adressManager) {
        console.log("Constructing request handler");
        this.discordApiAccessor = discordApiAccessor;
        this.discordAuthenticator = discordAuthenticator;
        this.mongoAccessor = mongoAccessor;
        this.rabbitCommunicator = rabbitCommunicator;
        this.adressManager = adressManager;
    }

    getRejectObject(error) {
        return {
            error: error,
            redirect: this.adressManager.getIndexURL({ "error": error })
        }
    }

    // request discord auth

    /**
     * 
     * @param {QueryObjet} query 
     * 
     * @returns id of user
     */
    requestDiscordAuth(query) { // expected query args: code, gameID
        return new Promise((resolve, reject) => {
            logRequestHandler("Handling request for discord auth...");
            if (query.code === undefined || query.code === null || query.gameID === "" || query.gameID === null || query.gameID === undefined || query.state === "") {
                reject(RequestHandler.ERRORS.INVALID_PARAMS);
                return;
            }
            this.discordAuthenticator.authenticateUser(query.code).then((discordData) => {
                logRequestHandler("User authenticated. Returning user ID");
                return resolve(discordData.id);
            }).catch((e) => {
                console.error("Caught error while requesting discord auth: " + e + " Sending DISCORD_API error to client...");
                reject(this.getRejectObject(RequestHandler.ERRORS.DISCORD_API_FAIL));
                return;
            });

        });
    }

    // start: requets join game data
    /**
     * @description get user profile data to display on prepare page
     * @param {QueryObject} query 
     * @param {string} query.userID
     * @param {string} query.code
     * @returns {Object} {discordAPI: , mong: , displayableInventory: }
     */
    getProfileData(query) {     // first discord then mongo then displayable mongo
        return new Promise((resolve, reject) => {
            console.log("Handling request for profile data...");
            const userID = query.userID;
            const code = query.code;
            if (code === undefined || userID === undefined || code === "" || userID === "" || code === null || userID === null) {
                logRequestHandler("INVALID PARAMS!");
                return reject(this.getRejectObject(RequestHandler.ERRORS.INVALID_PARAMS));
            }
            if (!this.discordAuthenticator.isAuthenticated(userID, code)) {
                logRequestHandler("NOT AUTENTICATED!");
                return reject(this.getRejectObject(RequestHandler.ERRORS.NOT_AUTHENTICATED));
            } else {
                const discordData = this.discordAuthenticator.getProfileData(userID, code);
                this.requestMongoJoinGameData(query, discordData.id).then((mongoData) => {      // then: get data from mongo
                    if (mongoData === null) {
                        console.log("Received mongo data is null, sending error to client...");
                        reject(this.getRejectObject(RequestHandler.ERRORS.MONGO_FAIL));
                    } else {
                        this.requestMongoDisplayableInventory(discordData.id, mongoData).then((displayableInventoryData) => {      // then: get visualizable data for client
                            resolve({
                                discordAPI: discordData,
                                mongo: mongoData,
                                displayableInventory: displayableInventoryData
                            })
                        });
                    }
                });
            }
        });
    }
    /**
     * @description flow: initial redirect page load data request. After: request mongo data. Requests displayable data of inventory objects
     * @param {*} query 
     * @param {*} mongoData 
     */
    async requestMongoDisplayableInventory(userID, mongoData) {
        const inventory = mongoData.inventory;      // inventory: {hotbarIDs: [], itemIDs: []
        return this.mongoAccessor.getDisplayableInventoryData(userID, inventory);
    }

    async requestMongoJoinGameData(query, discordID) {
        return this.mongoAccessor.getPlayerOrCreate(discordID);
    }

    // end: request join game data



    // start: join game
    /**
     * 
     * @param {Object} query 
     * @param {string} query.code
     * @param {string} query.gameID
     * @param {string} query.userID
     * @param {optionals} query.hotbar123456
     * @returns 
     */
    deployToGameIfPossible(query) {
        return new Promise((resolve, reject) => {
            console.log("Handling request for deploy to game if possible...");
            const userID = query.userID;
            const code = query.code;
            if (!this.discordAuthenticator.isAuthenticated(userID, code)) {
                logRequestHandler("NOT AUTENTICATED!");
                return reject(this.getRejectObject(RequestHandler.ERRORS.NOT_AUTHENTICATED));
            }
            const userData = this.discordAuthenticator.getProfileData(userID, code);
            const gameID = query.gameID;
            if (userData === null || userData === undefined) {
                console.error("User is not at all in auth map! Throwing invalid session");
                return reject(this.getRejectObject(RequestHandler.ERRORS.INVALID_SESSION));
            } else if (gameID === null || gameID === undefined) {
                console.error("Game to join not defined!");
                return reject(this.getRejectObject(RequestHandler.ERRORS.INVALID_LINK));
            }

            this.updateHotbar(query, userID).then(() => {
                this.createDeployData(userID, userData).then((deployData) => {
                    this.rabbitCommunicator.deployToGameIfPossibleAndHandleReply(gameID, deployData, (accessObjectMessage) => {
                        try {
                            if (accessObjectMessage.status === 1) {
                                console.log("Deploy successful! Adress is " + accessObjectMessage.shardUri);

                                // tweak uri: add playerID
                                var tweakedUri = accessObjectMessage.shardUri + "&userID=" + userID;
                                accessObjectMessage.shardUri = tweakedUri;
                                console.log("Tweaked uri to: " + tweakedUri);
                                resolve(accessObjectMessage);
                                return;
                            } else {
                                console.error("Deploy not successful! Error is " + accessObjectMessage.error + ". Sending error to client");
                                resolve(accessObjectMessage);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            });
        });
    }

    async updateHotbar(query, userID) {
        var hotbarIDs = [];
        for(var i = 0; i < 6; i+= 1) {
            if(query["hotbar" + i] !== undefined && query["hotbar" + i] !== "" && query["hotbar" + i] !== null) {
                hotbarIDs.push(query["hotbar" + i]);
            }
        }
        await this.mongoAccessor.updateHotbar(hotbarIDs, userID);
    }

    async createDeployData(userID, userData) {
        const mongoData = await this.mongoAccessor.getPlayerOrCreate(userID);
        const hotbar = await this.mongoAccessor.createHotbarObject(userID, mongoData.inventory);
        return {
            discordAPI: userData,
            hotbar: hotbar,
            accountLevel: mongoData.accountLevel
        }
    }

    // end: join game
}

function logRequestHandler(s) {
    console.log("[RequestHandler] " + s);
}

module.exports = RequestHandler;