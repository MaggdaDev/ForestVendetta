const MongoAccessor = require("../../../shared/mongoAccess/mongoAccessor");

class ForestScoutMongoAccessor {
    constructor(forestScout) {
        this.forestScout = forestScout;
        this.mongoAccess = new MongoAccessor();
        this.mongoAccess.connect();
    }


    async getPlayerOrCreate(userID) {
        logMongo("Get player or create if not existing...");
        const query = {discordID: userID};
        const player = await this.mongoAccess.playerCollection.findOne(query);
        if(player === null) {   // not existing
            logMongo("Player not existing; now being created...");
            const addPlayer = {discordID: String(userID), accountLevel: 1};
            await this.mongoAccess.playerCollection.insertOne({discordID: String(userID), accountLevel: 1});
            logMongo("Player created.");
        } else {
            logMongo("Player existing.");
            return player;
        }
        return await this.mongoAccess.playerCollection.findOne(query);
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