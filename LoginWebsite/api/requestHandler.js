const DiscordAPIAccessor = require("./dicordApiAccessor");

class RequestHandler {
    /**
     * 
     * @param {DiscordAPIAccessor} discordApiAccessor 
     */
    constructor(discordApiAccessor) {
        console.log("Constructing request handler");
        this.discordApiAccessor = discordApiAccessor;
    }

    requestJoinGameData(query) {
        const promise = new Promise((resolve, reject) => {
            console.log("Handling request for join match data...");
            if (query.code === undefined || query.token === null || query.token === "") {
                console.log("Empty code!");
                return;
            }
            this.discordApiAccessor.requestJoinGameData(query.code).then((token) => resolve(token));
        });
        return promise;
    }
}

module.exports = RequestHandler;