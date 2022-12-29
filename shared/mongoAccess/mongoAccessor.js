const { MongoClient } = require('mongodb');
const Connector = require('../connector');
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
        logMongo("Loaded connect config from '" + CONFIG_LOCATION + "/" + CONFIG_NAME + "' : " + JSON.stringify(this.connectConfig));
        this.client = new MongoClient(this.connectConfig.connectstring);

        // connect
        const instance = this;
        this.connector = new Connector(() => {
            const promise = new Promise((resolve, reject) => {
                instance.client.connect().then(() => {
                    logMongo("Connected successfully!");
                    instance.database = instance.client.db(MongoAccessor.DATABASE_NAME);
                    instance.playerCollection = instance.database.collection(MongoAccessor.PLAYER_COLLECTION_NAME);
                    instance.itemCollection = instance.database.collection(MongoAccessor.ITEM_COLLECTION_NAME);
                    instance.objectFactory = new ObjectFactory(instance);
                    resolve();
                }).catch((error) => reject(error));
            });
            return promise;
        });


    }

    connect() {
        logMongo("Trying to connect to mongo...");
        return this.connector.connectUntilSuccess(2000);
    }

    // requests

    async getPlayerOrCreate(userID) {
        logMongo("Get player or create if not existing...");
        const query = {_id: userID};
        const player = await this.playerCollection.findOne(query);
        if(player === null) {   // not existing
            logMongo("Player not existing; now being created...");
            var newplayer = this.objectFactory.addNewPlayer(userID);
            logMongo("Player created.");
            return newplayer;
        } else {
            logMongo("Player existing.");
            return player;
        }
    }

    /**
     * 
     * @param {string[]} itemIDs - item ids as array
     */
    async getItemObjectsFromIDs(itemIDs) {
        logMongo("Get itemObjects from IDs...");
        const query = {"_id": { "$in" : itemIDs}}
        const cursor = await this.itemCollection.find(query);
        const objects = await cursor.toArray();
        logMongo("Got " + objects.length + " items from hotbar.");
        return objects;
    }

    async updateHotbar(userID, hotbarIDs) {
        await this.playerCollection.updateOne({_id: userID}, { $set: {"inventory.hotbarIDs": hotbarIDs}});
        console.log("Updated hotbar in db");
    }
}

function logMongo(s) {
    console.log("[mongoAccess] " + s);
}

module.exports = MongoAccessor;