const ItemFactory = require("../items/ItemFactory");

class DropObject {
    constructor(itemName) {
        this.itemName = itemName;
        this.config = ItemFactory.getInstance().getConfig(itemName);
    }
}

module.exports = DropObject;