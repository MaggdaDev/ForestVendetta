
const LoginMongoAccessor = require("../mongo/loginMongoAccessor");
const LoginRabbitCommunicator = require("../rabbit/loginRabbitCommunicator");
const DiscordAPIAccessor = require("./dicordApiAccessor");

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
        MONGO_FAIL: "MONGO_FAIL"
    }
    /**
     * 
     * @param {DiscordAPIAccessor} discordApiAccessor 
     * @param {LoginMongoAccessor} mongoAccessor 
     * @param {LoginRabbitCommunicator} rabbitCommunicator
     * @param {Object} adressManager 
     * @param {Map} authMap - userid<->{mongo:, discordAPI:, code: }
     */
    constructor(discordApiAccessor, mongoAccessor, rabbitCommunicator, adressManager, authMap) {
        console.log("Constructing request handler");
        this.discordApiAccessor = discordApiAccessor;
        this.mongoAccessor = mongoAccessor;
        this.rabbitCommunicator = rabbitCommunicator;
        this.adressManager = adressManager;
        this.authMap = authMap;
    }

    getRejectObject(error) {
        return {
            error: error,
            redirect: this.adressManager.getIndexURL({ "error": error })
        }
    }

    // start: join game
    /**
     * 
     * @param {Object} query 
     * @param {string} query.code
     * @param {string} query.gameID
     * @param {string} query.userID
     * @returns 
     */
    deployToGameIfPossible(query) {
        return new Promise((resolve, reject) => {
            console.log("Handling request for deploy to game if possible...");
            const userID = query.userID;
            const userData = this.authMap.get(userID);
            const gameID = query.gameID;
            if (userData === null || userData === undefined) {
                console.error("User is not at all in auth map! Throwing invalid session");
                reject(this.getRejectObject(RequestHandler.ERRORS.INVALID_SESSION));
                return;
            }
            if (userData.code !== query.code) {
                console.error("Wrong user code!");
                reject(this.getRejectObject(RequestHandler.ERRORS.INVALID_SESSION));
                return;
            }
            if (gameID === null || gameID === undefined) {
                console.error("Game to join not defined!");
                reject(this.getRejectObject(RequestHandler.ERRORS.INVALID_LINK));
                return;
            }

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
    }

    async createDeployData(userID, userData) {
        const hotbar = await this.mongoAccessor.createHotbarObject(userID, userData.mongo.inventory);
        return {
            discordAPI: userData.discordAPI,
            hotbar: hotbar,
            accountLevel: userData.mongo.accountLevel
        }
    }

    // end: join game

    // start: requets join game data
    requestJoinGameData(query) {
        return new Promise((resolve, reject) => {
            console.log("Handling request for join match data...");
            //discord API data
            this.requestUserIdentifyData(query).then((discordData) => {     // first: request identification via discord
                if (discordData === null) {
                    console.log("Received discord data is null, sending error to client...");
                    reject(this.getRejectObject(RequestHandler.ERRORS.DISCORD_API_FAIL));
                } else {
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
                // discordAPI returned null


            }).catch((error) => {
                console.trace("Caught error: " + error);
                reject(error);
            });

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

    async requestUserIdentifyData(query) {
        if (query.code === undefined || query.code === null || query.code === "") {
            console.error("Empty code when trying to get user identify data!");
            return;
        }
        return this.discordApiAccessor.requestUserIdentifyData(query.code);
    }

    // end: request join game data
}

module.exports = RequestHandler;