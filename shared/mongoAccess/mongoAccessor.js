const { MongoClient } = require('mongodb');
const Connector = require('../connector');
const ObjectFactory = require('./objectFactory');

class MongoAccessor {
    static DATABASE_NAME = "forestvendetta";
    static PLAYER_COLLECTION_NAME = "players";
    static ITEM_COLLECTION_NAME = "items";

    static ITEM_CONTAINERS = {
        HOTBAR: "HOTBAR",
        ARMORBAR: "ARMORBAR"
    }
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

    connectUntilSuccess() {
        logMongo("Trying to connect to mongo...");
        return this.connector.connectUntilSuccess(2000);
    }

    // requests

    /**
     * @description inserts items into player inventory and IDs to items list. Also puts item into hotbar if not already full (may be removed in future TODO)
     * @param {string} userID - owner
     * @param {Object[]} items - mongo objects from factory with already noted owner [{._id, ownerDiscordID}]
     */
    async insertOwnedItems(userID, items) {
        const itemIDs = [];
        items.forEach((element) => {
            itemIDs.push(element._id);
        })

        if(itemIDs.length !== items.length) {
            throw(new Error("Bruh something went wrong on insert owned items"));
        }

        // insert ids to item
        await this.itemCollection.insertMany(items);
        logMongo("Inserted " + items.length + " items to item table.");

        // insert items to player inventory
        const query = {_id: userID};
        const currPlayer = await this.playerCollection.findOne(query);
        const ownedItemIDs = currPlayer.inventory.itemIDs;
        const hotbarItemIDs = currPlayer.inventory.hotbarIDs;
        itemIDs.forEach((element) => {
            if(ownedItemIDs.includes(element)) {
                throw(new Error("Item with ID " + element + " already in inventory of " + userID + " on owned items insertion!"));
            }
            ownedItemIDs.push(element);
            
            if(hotbarItemIDs.length < 6) {
                hotbarItemIDs.push(element);
                logMongo("Added owned item " + element + " to inventory of " + userID + " and pushed it to hotbar");
            } else {
                logMongo("Added owned item " + element + " to inventory of " + userID);
            }
        });

        await this.updateOwnedItems(ownedItemIDs, userID);
        await this.updateHotbar(userID, hotbarItemIDs);
    }

    /**
     * @description ONLY inserts item. Should not be used alone if you're not giga nigga
     * @param {Object} itemMongoObject 
     */
    async _insertItem(itemMongoObject) {
        logMongo("Insert 1 item into table");
        return this.itemCollection.insertOne(itemMongoObject);
    }

    /**
     * @description ONLY inserts player. Should not be used alone if you're not giga nigga
     * @param {Object} playerMongoObject 
     */
     async _insertPlayer(playerMongoObject) {
        logMongo("Insert 1 player into table");
        return this.playerCollection.insertOne(playerMongoObject);
    }

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
        logMongo("Got " + objects.length + " items as objects.");
        return objects;
    }

    async updateHotbar(userID, hotbarIDs) {
        await this.playerCollection.updateOne({_id: userID}, { $set: {"inventory.hotbarIDs": hotbarIDs}});
        console.log("Updated hotbar in db");
    }

    async updateArmorBar(userID, armorBarIDs) {
        await this.playerCollection.updateOne({_id: userID}, { $set: {"inventory.armorBarIDs": armorBarIDs}});
        console.log("Updated armorbar in db: " + armorBarIDs.length + " armoritems now.");
    }

    /**
     * 
     * @param {string} userID 
     * @param {string[]} containerIDs items to set as content of container
     * @param {string} itemContainer MUST be from MongoAccessor.ITEM_CONTAINERS: Hotbar/armorbar/...
     * @description UNCHECKED set and override container
     * @returns 
     */
    async updateItemContainer(userID, containerIDs, itemContainer) {
        switch(itemContainer) {
            case MongoAccessor.ITEM_CONTAINERS.ARMORBAR:
                return this.updateArmorBar(userID, containerIDs);
            case MongoAccessor.ITEM_CONTAINERS.HOTBAR:
                return this.updateHotbar(userID, containerIDs);
            default:
                throw "Item container type not implemented: " + itemContainer
        }
    }


    async updateOwnedItems(ownedItemIDs, userID) {
        await this.playerCollection.updateOne({_id: userID}, { $set: {"inventory.itemIDs": ownedItemIDs}});
        console.log("Updated owned items in db");
    }
}

function logMongo(s) {
    console.log("[mongoAccess] " + s);
}

module.exports = MongoAccessor;