const ItemObject = require("./itemObject");
const PlayerObject = require("./playerObject");

class InventoryObject {
    

    /**
     * 
     * @
     */
    constructor(defaultItem) {
        this.itemIDs = [];
        this.itemIDs.push(defaultItem._id);
        this.hotbarIDs = [];
        this.hotbarIDs.push(defaultItem._id);
        logInv("Constructed InventoryObject...");
    }

    addItem(i) {
        this.itemIDs.push(i._id);
        logInv("Added new item to inventory: " + i.itemName + " (" + i._id + ")");
    }
}

function logInv(s) {
    console.log("[InventoryObject] " + s);
}

module.exports = InventoryObject;