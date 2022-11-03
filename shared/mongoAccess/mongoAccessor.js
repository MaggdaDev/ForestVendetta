const {MongoClient} = require('mongodb');
const ObjectFactory = require('./objectFactory');

class MongoAccessor {
    static DATABASE_NAME = "forestvendetta";
    static PLAYER_COLLECTION_NAME = "players";
    static ITEM_COLLECTION_NAME = "items";
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
            this.itemCollection = this.database.collection(MongoAccessor.ITEM_COLLECTION_NAME);
            this.objectFactory = new ObjectFactory(this);
        });
        
    }
}

function logMongo(s) {
    console.log("[mongoAccess] " + s);
}

module.exports = MongoAccessor;