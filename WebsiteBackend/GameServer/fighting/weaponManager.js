const RustySpade = require("./swords/heavySwords/rustySpade");
const ObsidianPineNeedle = require("./swords/heavySwords/obsidianPineNeedle");

class WeaponManager {
    static _instance;
    constructor() {
        this.configFiles = new Map();
    }

    createNewWeapon(classWeapon, owner, weaponID) {
        const ret = new classWeapon(owner, weaponID);
        const key = ret.typeData.class + "/" + ret.typeData.subClass + "/" + ret.typeData.type;
        if (!this.configFiles.has(key)) {
            this.configFiles.set(key, require('../../GameplayConfig/Items/Weapons/' + key));
        }
        ret.applyConfig(this.configFiles.get(key));

        return ret;
    }

    /**
     * 
     * @param {Object} mongoItemData 
     * @param {string} mongoItemData._id
     * @param {string} mongoItemData.itemName
     * @param {string} mongoItemData.ownerDiscordID
     */
    fromMongoData(mongoItemData, owner) {
        const weaponID = mongoItemData._id;
        const itemName = mongoItemData.itemName;

        var ItemClass;
        switch (itemName) {             // NEEDS UPDATE ON NEW WEAPON
            case "RUSTY_SPADE":
                ItemClass = RustySpade;
                break;
            case "OBSIDIAN_PINE_NEEDLE":
                ItemClass = ObsidianPineNeedle;
                break;
            default:
                throw new Error("Unkown item type in fromMongoData, please implement");
                break;
        }

        return this.createNewWeapon(ItemClass, owner, weaponID);
    }

    /**
     * 
     * @returns {WeaponManager} instance
     */
    static instance() {
        if (WeaponManager._instance === null || WeaponManager._instance === undefined) {
            WeaponManager._instance = new WeaponManager();
        }
        return WeaponManager._instance;
    }
}

module.exports = WeaponManager;