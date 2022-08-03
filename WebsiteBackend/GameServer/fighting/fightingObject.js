class FightingObject {

    constructor(dmg, hp, gameUniqueId) {
        this.damage = dmg;
        this.hp = hp;
        this.maxHp = hp;
        this.id = gameUniqueId;
    }

    canDamage(other) {
        return true;
    }

    /**
     * 
     * @param {FightingObject} a - damager 
     * @param {FightingObject} b - damaged
     */
    static aDamageB(a, b) {
        b.hp -= a.damage;
        console.log("Damage!");
    }
}

module.exports = FightingObject;