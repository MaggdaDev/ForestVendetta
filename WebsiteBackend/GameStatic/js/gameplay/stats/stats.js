var StatClass;
if ((typeof module) === "undefined" && (typeof process) === "undefined"){
    StatClass = Stat;
} else {
    StatClass = require("./stat");
}


class Stats {
    constructor() {
        this.maxHpStat = new StatClass("maxHp", 0, 0);
        this.damageStat = new StatClass("damage", 0, 0);
        this.defenseStat = new StatClass("defense", 0, 0);

        this.stats = [
            this.maxHpStat, this.damageStat, this.defenseStat
        ]
    }

    /**
     * 
     * @param {Object} stats stats object to copy (may be just json data)
     */
    overrideFrom(stats) {
        this.stats.forEach((currStat, idx) => {
            currStat.setValue(stats.stats[idx]._value);
        })
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

    

    reduceDamage(damage) {
        //defense
        damage *= Stats._damageMultiplierFromDefense(this.defenseStat.getValue());
        return damage;
    }

    static _damageMultiplierFromDefense(defense) {
        if(defense > 0) {
            return 1.0 / (0.01 * defense + 1);
        } else {
            return -0.01 * defense + 1;
        }
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