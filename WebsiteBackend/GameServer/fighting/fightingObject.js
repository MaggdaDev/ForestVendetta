const NetworkCommands = require("../../GameStatic/js/network/networkCommands");
const Vector = require("../../GameStatic/js/maths/vector");
const FacadeForFightingObject = require("./facadeForFightingObject");

class FightingObject {

    /**
     * @param {FacadeForFightingObject} facade - needs getOwnerPosition(), getOwnerStats()
     * @param {*} gameUniqueId 
     */
    constructor(facade, gameUniqueId) {
        this.facade = facade;
        this.id = gameUniqueId;
        this.onDamageTakenHandlers = [];
        this.onDamageDealtHandlers = [];
        this.onDeathHandlers = [];

        this.hp = this._getMaxHp();
    }

    _getMaxHp() {
        return this.facade.getOwnerStats().maxHpStat.getValue();
    }

    /**
     * 
     * @param {FightingObject} a 
     * @param {FightingObject} b 
     * @param {*} damagePos 
     * @returns 
     */
    static aDamageB(a, b, damagePos) {
        const aPos = a.getOwnerPosition();
        const bPos = b.getOwnerPosition();
        console.log("Damage!");

        // damage procedure start
        var damage = a.getDamage();
        const damageDealt = b.applyDamage(damage);
        // damage procedure end
        

        b.onDamageTakenHandlers.forEach((currHandler)=>{
            currHandler(damageDealt, damagePos, Vector.subtractFrom(bPos, damagePos).dirVec);
        });
        a.onDamageDealtHandlers.forEach((currHandler)=>{
            currHandler(damageDealt, damagePos, Vector.subtractFrom(aPos, damagePos).dirVec)
        });

        if(b.hp <= 0) {
            console.log("Death in fighting object " + this.id + " detected. Calling " + b.onDeathHandlers.length + " handlers.");
            b.onDeathHandlers.forEach((currHandler) => {
                currHandler(a.id);
            });
        }
        return damageDealt;
    }


    /**
     * @description final applying of damage object without any other calculations
     * @param {number} damage 
     */
    applyDamage(damage) {
        const oldHp = this.hp;
        this.hp -= this._getStats().reduceDamage(damage);

        return oldHp - this.hp;
    }

    _getStats() {
        return this.facade.getOwnerStats();
    }

    getDamage() {
        return this.facade.getOwnerStats().damageStat.getValue();
    }

    getOwnerPosition() {
        return this.facade.getOwnerPosition();
    }

    getCurrentHP() {
        return this.hp;
    }

    resetHp() {
        this.hp = this._getMaxHp();
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

    /**
     * 
     * @param {function(killerID)} handler 
     */
    addOnDeath(handler) {
        this.onDeathHandlers.push(handler);
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
    
    

    isAlive() {
        return this.hp > 0;
    }
}

function logFightingObject(s) {
    console.log("[FightingObject] " + s);
}

module.exports = FightingObject;