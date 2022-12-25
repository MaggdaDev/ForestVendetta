
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
        INVALID_LINK: "INVALID_LINK"
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

    static getRejectObject(error) {
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
                reject(RequestHandler.getRejectObject(RequestHandler.ERRORS.INVALID_SESSION));
                return;
            }
            if (userData.code !== query.code) {
                console.error("Wrong user code!");
                reject(RequestHandler.getRejectObject(RequestHandler.ERRORS.INVALID_SESSION));
                return;
            }
            if (gameID === null || gameID === undefined) {
                console.error("Game to join not defined!");
                reject(RequestHandler.getRejectObject(RequestHandler.ERRORS.INVALID_LINK));
                return;
            }

            this.rabbitCommunicator.deployToGameIfPossibleAndHandleReply(gameID, userData, (message) => {
                try {
                    if (message.status === 1) {
                        console.log("Deploy successful! Adress is " + message.shardUri);

                        // tweak uri: add playerID
                        var tweakedUri = message.shardUri + "&userID=" + userID;
                        console.log("Tweaked uri to: " + tweakedUri);
                        resolve(tweakedUri);
                        return;
                    } else {
                        console.error("Deploy not successful! Error is " + message.error);
                        reject(message.error);
                    }
                } catch (e) {
                    reject(e);
                }
            });


        });
    }

    // start: requets join game data
    requestJoinGameData(query) {
        return new Promise((resolve, reject) => {
            console.log("Handling request for join match data...");
            //discord API data
            this.requestUserIdentifyData(query).then((discordData) => {
                this.requestMongoJoinGameData(query, discordData.id).then((mongoData) => {
                    resolve({
                        discordAPI: discordData,
                        mongo: mongoData
                    })
                });
                // discordAPI returned null


            }).catch((error) => {
                if (error.startsWith("401")) {   // unauthorized
                    reject(RequestHandler.getRejectObject(RequestHandler.ERRORS.DISCORD_API_FAIL));
                }
            });

        });
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