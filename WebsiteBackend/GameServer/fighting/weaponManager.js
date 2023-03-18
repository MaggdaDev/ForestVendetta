const RustySpade = require("./swords/heavySwords/rustySpade");
const ObsidianPineNeedle = require("./swords/heavySwords/obsidianPineNeedle");
const fs = require("fs")
const path = require("path");
const SlimySpade = require("./swords/heavySwords/slimySpade");

class WeaponManager {
    static _instance;
    constructor() {
        this.configFiles = this.loadFilesRecursive("./GameplayConfig/Items/Weapons/");
    }

    createNewWeapon(classWeapon, owner, weaponID) {
        const ret = new classWeapon(owner, weaponID);
        ret.applyConfig(WeaponManager.getConfigFile(ret.typeData.type));

        return ret;
    }

    static getConfigFile(key) {
        const inst = WeaponManager.instance();
        return inst.configFiles.get(key);
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
            case "SLIMY_SPADE":
                ItemClass = SlimySpade;
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

    loadFilesRecursive(dir, map) {
        var isStart =  false;
        if(map === undefined) {
            isStart = true;
            map = new Map();
            console.log("Loading weapon config files recursively")
        }
        const fileNames = fs.readdirSync(path.resolve(dir));
        fileNames.forEach(currFile => {
            const splitted = currFile.split(".");
            if(splitted.length !== 2) {
                this.loadFilesRecursive(dir + "/" + currFile, map);
            } else {
                map.set(splitted[0], JSON.parse(fs.readFileSync(dir + "/" + currFile, {encoding: "utf8"})));
            }
        });

        if(isStart) {
            return map;
        }
    }
}

module.exports = WeaponManager;