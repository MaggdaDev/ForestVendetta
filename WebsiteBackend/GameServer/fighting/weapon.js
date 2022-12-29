class Weapon {
    /**
     * 
     * @param {Object} typeData 
     * @param {string} typeData.class
     * @param {string} typeData.subClass
     * @param {string} typeData.type
     */
    static currentId = 0;
    constructor(typeData, owner, weaponID) {
        this.typeData = typeData;
        this.id = weaponID;
        this.fighter = owner.fightingObject;
        this.owner = owner;
    }

    applyConfig(config) {       // loading all attributes
        this.rarity = config.rarity;
        this.baseCombatStats = config.stats;
    }

    /**
     * OVERRIDE
     */
     toJSON() {
        var instance = this;
        return {
            id: instance.id,
            typeData: instance.typeData
        }
    }

    strike() {
        console.error("STRIKE METHOD NOT OVERRIDDEN: " + JSON.stringify(this.typeData));
    }

    update(timeElapsed, facingLeft) {
        console.error("UPDATE METHOD NOT OVERRIDDEN: " + JSON.stringify(this.typeData));
    }

    getCooldown() {
        console.error("GET COOLDOWN METHOD NOT OVERRIDDEN: " + JSON.stringify(this.typeData));
    }

    get now() {
        return Date.now() / 1000.0;
    }
}

module.exports = Weapon;