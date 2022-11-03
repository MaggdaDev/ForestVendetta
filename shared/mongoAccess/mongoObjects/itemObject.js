class ItemObject {

    /**
     * 
     * @param {string} ownerDiscordID - i.e. 2937829738926
     * @param {string} itemName - i.e. RUSTY_SPADE
     */
    constructor(itemID, ownerDiscordID, itemName) {
        this._id = itemID;
        this.ownerDiscordID = ownerDiscordID;
        this.itemName = itemName;
        logItem("New '" + itemName + "' with ID: '" + this._id + "' constructed for user with ID: " + ownerDiscordID);
    }

}

function logItem(s) {
    console.log("[ItemObject] " + s);
}

module.exports = ItemObject;