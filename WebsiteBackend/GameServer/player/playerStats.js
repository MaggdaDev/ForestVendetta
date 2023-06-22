const Stats = require("../../GameStatic/js/gameplay/stats/stats");

class PlayerStats {
    static DEFAULT_STATS = {
        maxHp: 100,
        damage: 0,
        defense: 0
    }

    constructor() {
        this.ownStats = new Stats();
        this.ownStats.maxHpStat.setValue(PlayerStats.DEFAULT_STATS.maxHp);
        this.ownStats.damageStat.setValue(PlayerStats.DEFAULT_STATS.damage);
        this.ownStats.defenseStat.setValue(PlayerStats.DEFAULT_STATS.defense);

        this.armorPieceStats = [];
        this.weaponStats = null;
    }

    /**
     * 
     * @param {Stats} armorPieceStats the stats of one armor piece (expected to be same piece for whole match) 
     */
    addArmorPieceStats(armorPieceStats) {
        if(armorPieceStats === undefined || armorPieceStats === null) {
            throw "Armor piece stats must not be null/undefined";
        }
        this.armorPieceStats.push(armorPieceStats);
    }
    
    /**
     * 
     * @param {Stats} weaponStats stats of weapon currently holding or null if none
     */
    setWeaponStats(weaponStats) {
        if(weaponStats === undefined) {
            throw "Weapon stats must not be undefined";
        }
        this.weaponStats = weaponStats;
    }

    /**
     * @description creates a new stats object with all combined stats (player,items,weapon,armor)
     */
    getTotalStats() {
        const retStats = new Stats();

        // own stats
        retStats.addToMe(this.ownStats);
        // armor
        this.armorPieceStats.forEach((currArmorPieceStats) => {
            retStats.addToMe(currArmorPieceStats);
        })
        // item in hand
        if(this.weaponStats !== null) {
            retStats.addToMe(this.weaponStats);
        }
        return retStats;
    }


}

module.exports = PlayerStats;