const DiscordAPIAccessor = require("./dicordApiAccessor");

class RequestHandler {
    /**
     * 
     * @param {DiscordAPIAccessor} discordApiAccessor 
     */
    constructor(discordApiAccessor, mongoAccessor) {
        console.log("Constructing request handler");
        this.discordApiAccessor = discordApiAccessor;
        this.mongoAccessor = mongoAccessor;
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
            });          
       
        });
    }

    async requestMongoJoinGameData(query, discordID) {
        this.mongoAccessor;
    }

    async requestUserIdentifyData(query) {
        if (query.code === undefined || query.token === null || query.token === "") {
            console.error("Empty code when trying to get user identify data!");
            return;
        }
        return this.discordApiAccessor.requestUserIdentifyData(query.code);  
    }
}

module.exports = RequestHandler;