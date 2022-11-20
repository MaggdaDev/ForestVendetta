const MongoAccessor = require("../../../shared/mongoAccess/mongoAccessor");

class ForestScoutMongoAccessor {
    constructor(forestScout, mongoAccessor) {
        this.forestScout = forestScout;
        this.mongoAccess = mongoAccessor;
    }


    async getPlayerOrCreate(userID) {
        logMongo("Get player or create if not existing...");
        const query = {_id: userID};
        const player = await this.mongoAccess.playerCollection.findOne(query);
        if(player === null) {   // not existing
            logMongo("Player not existing; now being created...");
            var newplayer = this.mongoAccess.objectFactory.addNewPlayer(userID);
            logMongo("Player created.");
            return newplayer;
        } else {
            logMongo("Player existing.");
            return player;
        }
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