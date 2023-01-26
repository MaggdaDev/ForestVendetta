const MongoAccessor = require("../../shared/mongoAccess/mongoAccessor");
class LoginMongoAccessor {
    constructor() {
        this.mongoAccessor = new MongoAccessor();
    }

    /**
     * @description flow: Display inventory on redirect page load. User inventory object to get information about items in hotbar and inventory
     * @param {string} userID
     * @param {object} inventory 
     * @param {string[]} inventory.hotbarIDs
     * @param {string[]} inventory.itemIDs
     * @returns {inventory: [], hotbar: []}
     */
    async getDisplayableInventoryData(userID, inventory) {
        const hotbarObject = await this.createHotbarObject(userID, inventory)
        const inventoryObject = await this.getItemObjectsFromIDs(inventory.itemIDs);
        console.log("Retrieved hotbar object and inventory object for client display")
        return {inventory: inventoryObject, hotbar: hotbarObject}
    }

    async createHotbarObject(userID, mongoInventoryObject) {
        mongoInventoryObject.itemIDs = await this.getCheckedOwnedItems(mongoInventoryObject, userID);   // check if owned items have this as owner
        const hotbarIDs = await this.getCheckedHotbarIDs(userID, mongoInventoryObject);     // check if hotbar items are actually owned
        const hotbarItems = await this.getItemObjectsFromIDs(hotbarIDs);
        console.log("Created hotbar Object.");
        return hotbarItems;
    }
/**
 * 
 * @param {Object} mongoInventoryObject 
 * @returns {string[]} ownedIDs
 */
    async getCheckedOwnedItems(mongoInventoryObject, userID) {    // check if owned items have this as owner
        console.log("Checking for not owned items...");
        const ownedIDsMongo = mongoInventoryObject.itemIDs;
        const ownedItemObjects = await this.mongoAccessor.getItemObjectsFromIDs(ownedIDsMongo);
        var checkedIDs = [];
        ownedItemObjects.forEach((element, index) => {
            if(element.ownerDiscordID !== userID) {
                console.error("Found item with owner " + element.ownerDiscordID + " at " + userID + ". Deleting it.");
            } else {
                checkedIDs.push(element._id);
            }
        });
        this.mongoAccessor.updateOwnedItems(checkedIDs, userID);
        console.log("Removed " + (ownedIDsMongo.length - checkedIDs.length) + " illegally owned items");
        return checkedIDs;
    }

    async getItemObjectsFromIDs(itemIDs) {      // for hotbar construction i.e.
        return await this.mongoAccessor.getItemObjectsFromIDs(itemIDs);
    }

    async getCheckedHotbarIDs(userID, mongoInventoryObject) {
        const hotbarIDs = mongoInventoryObject.hotbarIDs;
        const ownedIDs = mongoInventoryObject.itemIDs;
        var modified = false;
        const idxToRemove = [];
        hotbarIDs.forEach((element, index) => {
            if (!ownedIDs.includes(element)) {
                idxToRemove.push(index);
                console.log("Found ERROR! Following item is in hotbar but not owned: " + element);
            }
        });
        idxToRemove.forEach((idx) => {
            hotbarIDs.splice(idx, 1);
            modified = true;
        });

        if (modified) {          // DATABASE ACCESS: REWRITE WITHOUT ERROR
            await this.mongoAccessor.updateHotbar(userID, hotbarIDs);
        } else {

            console.log("Checked hotbar; no error");
            
        }

        return hotbarIDs;
    }

    async getPlayerOrCreate(userID) {
        return this.mongoAccessor.getPlayerOrCreate(userID);
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.mongoAccessor.connectUntilSuccess().then(resolve);
        })
    }


}

module.exports = LoginMongoAccessor;