const Item = require("../item");
const Stats = require("../../../GameStatic/js/gameplay/stats/stats");
class ArmorPiece extends Item{
    constructor(owner, id) {
        super(owner, id);
        super.setCathegory("ARMOR");
    }

    getStats() {
        return this.baseCombatStats;
    }

    getDefense() {
        const ret = this.configObject.stats.defense;
        if (ret === undefined) return 0;
        return ret;
    }

    applyConfig(config) {       // loading all attributes
        this.rarity = config.rarity;
        this.baseCombatStats = Stats.fromConfigJson(config.stats);
        this.setClass(config.class);
    }

    /**
     * @returns {Stats}
     */
    getStats() {
        return this.baseCombatStats;
    }
}

module.exports = ArmorPiece;