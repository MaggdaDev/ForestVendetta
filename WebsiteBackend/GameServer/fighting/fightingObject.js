class FightingObject {

    constructor(dmg, hp) {
        this.damage = dmg;
        this.hp = hp;
        this.maxHp = hp;
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