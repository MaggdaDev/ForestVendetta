const WeaponManager = require("../fighting/weaponManager");

class DropObject {
    constructor(itemName) {
        this.itemName = itemName;
        this.config = WeaponManager.getConfigFile(itemName);
    }
}

module.exports = DropObject;