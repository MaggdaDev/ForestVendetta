const { ObjectId } = require("mongodb");
const IDGenerator = require("../idGen/idGenerator");
const MongoAccessor = require("./mongoAccessor");
const ItemObject = require("./mongoObjects/itemObject");
const PlayerObject = require("./mongoObjects/playerObject");

class ObjectFactory {
    static DEFAULT_ITEM_NAME = "RUSTY_SPADE";
    /**
     * 
     * @param {MongoAccessor} mongoAccessor 
     */
    constructor(mongoAccessor) {
        this.accessor = mongoAccessor;
    }

    async addNewPlayer(discordID) {
        const constructed = ObjectFactory.constructPlayerAndWeapon(discordID);
        this.accessor._insertItem(constructed.weapon);
        this.accessor._insertPlayer(constructed.player);
        return constructed.player;
    }

    static createNewItem(itemName, ownerID) {
        const addItem = new ItemObject(IDGenerator.instance().nextItemID(), ownerID, itemName);
        return addItem;
    }

    static createDefaultItem(ownerID) {
        return ObjectFactory.createNewItem(ObjectFactory.DEFAULT_ITEM_NAME, ownerID);
    }

    static constructPlayerAndWeapon(discordID) {
        const defaultWeapon = ObjectFactory.createDefaultItem(discordID);
        const addPlayer = new PlayerObject(discordID, defaultWeapon);
        return {player: addPlayer, weapon: defaultWeapon};
    }
}

module.exports = ObjectFactory;