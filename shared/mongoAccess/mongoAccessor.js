const {MongoClient} = require('mongodb');

class MongoAccessor {
    static DATABASE_NAME = "forestvendetta";
    static PLAYER_COLLECTION_NAME = "players";
    constructor() {
        logMongo("Initializing mongo connection...")

        // requiring connect string
        const CONFIG_LOCATION = '../../config-example';
        const CONFIG_NAME = 'mongodb';
        this.connectConfig = require(CONFIG_LOCATION + "/" + CONFIG_NAME);

        // connect
        logMongo("Loaded connect config from '" + CONFIG_LOCATION + "/" + CONFIG_NAME + "' : " + JSON.stringify(this.connectConfig));

    }

    connect() {
        logMongo("Trying to connect to mongo...");
        this.client = new MongoClient(this.connectConfig.connectstring);
        this.client.connect().then(() => {
            logMongo("Connected successfully!");
            this.database = this.client.db(MongoAccessor.DATABASE_NAME);
            this.playerCollection = this.database.collection(MongoAccessor.PLAYER_COLLECTION_NAME);
        });
        
    }
}

function logMongo(s) {
    console.log("[mongoAccess] " + s);
}

module.exports = MongoAccessor;