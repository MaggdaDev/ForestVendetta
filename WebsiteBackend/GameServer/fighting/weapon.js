class Weapon {
    /**
     * 
     * @param {Object} typeData 
     * @param {string} typeData.class
     * @param {string} typeData.subClass
     * @param {string} typeData.type
     */
    static currentId = 0;
    constructor(typeData, fighter) {
        this.typeData = typeData;
        this.id = Weapon.nextWeaponId();
        this.fighter = fighter;
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

    static nextWeaponId() {
        var temp = Weapon.currentId;
        Weapon.currentId++;
        return "W" + String(temp);
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