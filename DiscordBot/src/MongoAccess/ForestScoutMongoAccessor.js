const MongoAccessor = require("../../../shared/mongoAccess/mongoAccessor");

class ForestScoutMongoAccessor {
    constructor(forestScout, mongoAccessor) {
        this.forestScout = forestScout;
        this.mongoAccess = mongoAccessor;
    }


    async getPlayerOrCreate(userID) {
        return this.mongoAccess.getPlayerOrCreate(userID);
    }

    async getAccountLevel(userID) {
        logMongo("Trying to get Account lvl...");
        const player = await this.getPlayerOrCreate(userID);
        return player.accountLevel;
    }
}

function logMongo(s) {
    console.log("[ForestScoutMongoAccessor] " + s);
}

module.exports = ForestScoutMongoAccessor;