const FileLoader = require("../util/fileLoader");
const ObsidianPineNeedle = require("./weapons/swords/heavySwords/obsidianPineNeedle");
const RustySpade = require("./weapons/swords/heavySwords/rustySpade");
const SlimySpade = require("./weapons/swords/heavySwords/slimySpade");

class ItemFactory {
    static instance;
    constructor() {
        const weaponConfig = FileLoader.loadFilesRecursive("./GameplayConfig/Items/Weapons/");
        const armorConfig = FileLoader.loadFilesRecursive("./GameplayConfig/Items/Armor/");
        this.config = new Map(weaponConfig, armorConfig);
    }

    /**
     * 
     * @returns {ItemFactory}
     */
    static getInstance() {
        if (ItemFactory.instance === undefined) {
            ItemFactory.instance = new ItemFactory();
        }
        return ItemFactory.instance;
    }

    makeItem(ItemClass, owner, id) {
        const ret = new ItemClass(owner, id);
        ret.applyConfig(this.getConfig(ret.getName()));

        return ret;
    }

    getConfig(name) {
        return this.config.get(name);
    }

    static makeItemFromMongoData(mongoItemData, owner) {
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
            case "FROG_BOOTS":
                ItemClass = FrogBoots;
                break;
            default:
                throw new Error("Unkown item type in fromMongoData, please implement");
                break;
        }

        return ItemFactory.getInstance().makeItem(ItemClass, owner, weaponID);
    }


}

module.exports = ItemFactory;