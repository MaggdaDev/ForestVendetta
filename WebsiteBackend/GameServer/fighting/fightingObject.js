const NetworkCommands = require("../../GameStatic/js/network/networkCommands");
const Vector = require("../physics/vector");

class FightingObject {

    constructor(dmg, hp, gameUniqueId) {
        this.damage = dmg;
        this.hp = hp;
        this.maxHp = hp;
        this.id = gameUniqueId;
        this.onDamageTakenHandlers = [];
        this.onDamageDealtHandlers = [];
    }

    /**
     * 
     * @param {function(damageTaken, damagePosition, damageNormalAway)} handler 
     */
    addOnDamageTaken(handler) {
        this.onDamageTakenHandlers.push(handler);
    }

    /**
     * 
     * @param {function(damageDealt, damagePosition, damageNormalAway)} handler 
     */
    addOnDamageDealt(handler) {
        this.onDamageDealtHandlers.push(handler);
    }

    canDamage(other) {
        return true;
    }

    /**
     * 
     * @param {FightingObject} a - damager 
     * @param {FightingObject} b - damaged
     * @param {Vector} pos - the position of the damage
     * @param {SocketUser[]} - list of sockets to send damage particly to
     */
    static aDamageB(a, b, aPos, bPos, damagePos) {
        b.hp -= a.damage;
        console.log("Damage!");
        b.onDamageTakenHandlers.forEach((currHandler)=>{
            currHandler(a.damage, damagePos, Vector.subtractFrom(bPos, damagePos).dirVec);
        });
        a.onDamageDealtHandlers.forEach((currHandler)=>{
            currHandler(a.damage, damagePos, Vector.subtractFrom(aPos, damagePos).dirVec)
        });
        return a.damage;
    }
    

    isAlive() {
        return this.hp > 0;
    }
}

module.exports = FightingObject;