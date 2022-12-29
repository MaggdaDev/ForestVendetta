const InventoryObject = require("./inventoryObject.js");

class PlayerObject {
    static START_ACCOUNT_LEVEL = 1;
    constructor(discordID, defaultItem) {
        this._id = discordID;
        this.accountLevel = PlayerObject.START_ACCOUNT_LEVEL;
        this.inventory = new InventoryObject(defaultItem);
        logPlayer("Constructed new player object! DiscordID: " + discordID);
    }

    set defaultWeapon(w) {
        this.inventory.addItem(w);
    }
}

function logPlayer(s) {
    console.log("[PlayerObject] " + s);
}

module.exports = PlayerObject;