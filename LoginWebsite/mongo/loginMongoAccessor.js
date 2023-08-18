const MongoAccessor = require("../../shared/mongoAccess/mongoAccessor");
class LoginMongoAccessor {
    
    constructor() {
        this.mongoAccessor = new MongoAccessor();
    }

    async addEmote(userID, emoteID, emoteName) {
        await this.mongoAccessor.addEmote(userID, emoteID, emoteName);
    }

    async removeEmote(userID, emoteID) {
        await this.mongoAccessor.removeEmote(userID, emoteID);
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
        const hotbarObject = await this.createHotbarObject(userID, inventory);
        const armorBarObject = await this.createArmorBarObject(userID, inventory);
        const inventoryObject = await this.getItemObjectsFromIDs(inventory.itemIDs);
        console.log("Retrieved hotbar object and inventory object for client display")
        return { inventory: inventoryObject, hotbar: hotbarObject, armorBar: armorBarObject }
    }

    async createHotbarObject(userID, mongoInventoryObject) {
        mongoInventoryObject.itemIDs = await this.getAndUpdatePlayerInventory(mongoInventoryObject, userID);   // check if owned items have this as owner
        const hotbarIDs = await this.getCheckedContainerIDs(userID, mongoInventoryObject, MongoAccessor.ITEM_CONTAINERS.HOTBAR);     // check if hotbar items are actually owned
        const hotbarItems = await this.getItemObjectsFromIDs(hotbarIDs);
        console.log("Created hotbar Object.");
        return hotbarItems;
    }

    async createArmorBarObject(userID, mongoInventoryObject) {
        mongoInventoryObject.itemIDs = await this.getAndUpdatePlayerInventory(mongoInventoryObject, userID);   // check if owned items have this as owner
        const armorBarIDs = await this.getCheckedContainerIDs(userID, mongoInventoryObject, MongoAccessor.ITEM_CONTAINERS.ARMORBAR);     // check if armorbar items are actually owned
        const armorBarItems = await this.getItemObjectsFromIDs(armorBarIDs);
        console.log("Created armor bar Object.");
        return armorBarItems;
    }

    async updateBars(hotbarIDs, armorBarIDs, userID) {
        const ownedHotbarItems = await this.filterOwnedItems(hotbarIDs, userID);
        const ownedArmorBarItems = await this.filterOwnedItems(armorBarIDs, userID);
        this.mongoAccessor.updateHotbar(userID, ownedHotbarItems);
        this.mongoAccessor.updateArmorBar(userID, ownedArmorBarItems);
    }

    async filterOwnedItems(items, userID) {
        console.log("Checking array for not owned items...");
        const itemObjectsToCheck = await this.mongoAccessor.getItemObjectsFromIDs(items);
        var checkedIDs = [];
        itemObjectsToCheck.forEach((element, index) => {
            if (element.ownerDiscordID !== userID) {
                console.error("Found item with owner " + element.ownerDiscordID + " at " + userID + ". Filtering out.");
            } else {
                checkedIDs.push(element._id);
            }
        });
        console.log("Filtered out " + (items.length - checkedIDs.length) + " illegally owned items");
        return checkedIDs;
    }
    /**
     * 
     * @param {Object} mongoInventoryObject 
     * @returns {string[]} ownedIDs
     */
    async getAndUpdatePlayerInventory(mongoInventoryObject, userID) {    // check if owned items have this as owner
        console.log("Checking for not owned items...");
        const ownedIDsMongo = mongoInventoryObject.itemIDs;
        const checkedIDs = await this.filterOwnedItems(ownedIDsMongo, userID);
        this.mongoAccessor.updateOwnedItems(checkedIDs, userID);
        console.log("Update owned item count to " + checkedIDs.length);
        return checkedIDs;
    }

    async getItemObjectsFromIDs(itemIDs) {      // for hotbar construction i.e.
        return await this.mongoAccessor.getItemObjectsFromIDs(itemIDs);
    }

    /**
     * 
     * @param {*} userID 
     * @param {*} mongoInventoryObject 
     * @param {string} itemContainer HOTBAR or ARMORBAR
     * @returns 
     */
    async getCheckedContainerIDs(userID, mongoInventoryObject, itemContainer) {
        var containerIDs;
        switch (itemContainer) {
            case MongoAccessor.ITEM_CONTAINERS.HOTBAR:
                containerIDs = mongoInventoryObject.hotbarIDs;
                break;
            case MongoAccessor.ITEM_CONTAINERS.ARMORBAR:
                containerIDs = mongoInventoryObject.armorBarIDs;
                break;
            default:
                throw "Unsupported container type: " + itemContainer
        }
        if(containerIDs === undefined) containerIDs = []
        const ownedIDs = mongoInventoryObject.itemIDs;
        var modified = false;
        const idxToRemove = [];
        containerIDs.forEach((element, index) => {
            if (!ownedIDs.includes(element)) {
                idxToRemove.push(index);
                console.log("Found ERROR! Following item is in " + itemContainer + " but not owned: " + element);
            }
        });
        idxToRemove.forEach((idx) => {
            containerIDs.splice(idx, 1);
            modified = true;
        });

        if (modified) {          // DATABASE ACCESS: REWRITE WITHOUT ERROR
            await this.mongoAccessor.updateItemContainer(userID, containerIDs, itemContainer);
        } else {

            console.log("Checked " + itemContainer + "; no error");

        }

        return containerIDs;
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