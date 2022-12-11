
const LoginMongoAccessor = require("../mongo/loginMongoAccessor");
const DiscordAPIAccessor = require("./dicordApiAccessor");

class RequestHandler {
    /**
     * 
     * @param {DiscordAPIAccessor} discordApiAccessor 
     * @param {LoginMongoAccessor} mongoAccessor
     */

    // errors
    static ERRORS = {
        DISCORD_API_FAIL: "DISCORD_API_FAIL"
    }
    constructor(discordApiAccessor, mongoAccessor, adressManager) {
        console.log("Constructing request handler");
        this.discordApiAccessor = discordApiAccessor;
        this.mongoAccessor = mongoAccessor;
        this.adressManager = adressManager;
    }

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
                    reject({
                        error: RequestHandler.ERRORS.DISCORD_API_FAIL,
                        redirect: this.adressManager.getIndexURL({ error: RequestHandler.ERRORS.DISCORD_API_FAIL })
                    })
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
}

module.exports = RequestHandler;