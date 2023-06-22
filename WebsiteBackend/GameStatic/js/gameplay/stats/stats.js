var Stat;
if (process.env.NODE_ENV === "test") {
    Stat = require("./stat");
} else if(typeof module !== 'undefined'){
    Stat = require("./stat");
}


class Stats {
    constructor() {
        this.maxHpStat = new Stat("maxHp", 0, 0);
        this.damageStat = new Stat("damage", 0, 0);
        this.defenseStat = new Stat("defense", 0, 0);

        this.stats = [
            this.maxHpStat, this.damageStat, this.defenseStat
        ]
    }

    /**
     * 
     * @param {Stats} statsToAdd 
     */
    addToMe(statsToAdd) {
        this.stats.forEach((currThisStat, idx) => {
            currThisStat.addToMe(statsToAdd.stats[idx]);
        });
    }

    static fromConfigJson(jsonObj) {
        const ret = new Stats();
        if(jsonObj.max_hp !== undefined) {
            ret.maxHpStat.setValue(jsonObj.max_hp);
        }
        if(jsonObj.damage !== undefined) {
            ret.damageStat.setValue(jsonObj.damage);
        }
        if(jsonObj.defense !== undefined) {
            ret.defenseStat.setValue(jsonObj.defense);
        }

        return ret;
    }

    
}

if (typeof module !== 'undefined') {
    module.exports = Stats;
}