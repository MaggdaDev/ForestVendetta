const NetworkCommands = require("../../GameStatic/js/network/networkCommands");
const Vector = require("../../GameStatic/js/maths/vector");
const DamageVisitor = require("./damageProcessing/damageVisitors/damageVisitor");
const DamageObject = require("./damageProcessing/damageObject");
const FacadeForFightingObject = require("./facadeForFightingObject");

class FightingObject {

    /**
     * @param {FacadeForFightingObject} facade
     * @param {*} hp 
     * @param {*} gameUniqueId 
     */
    constructor(facade, baseDamage, baseHp, gameUniqueId) {
        this.facade = facade;
        this.baseDamage = baseDamage;
        this.hp = baseHp;
        this.maxHp = baseHp;
        this.id = gameUniqueId;
        this.onDamageTakenHandlers = [];
        this.onDamageDealtHandlers = [];
        this.onDeathHandlers = [];

        // visitors
        this.damageDealtVisitors = [];
        this.damageReceivedVisitors = [];
    }

    static aDamageB(a, b, damagePos) {
        const aPos = a.getOwnerPosition();
        const bPos = b.getOwnerPosition();
        console.log("Damage!");

        // damage procedure start
        const damageObject = new DamageObject(a.getBaseDamage());
        a.applyDamageDealtVisitors(damageObject);
        b.applyDamageReceivedVisitors(damageObject);
        const damageDealt = b.applyDamageObject(damageObject);
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

    applyDamageDealtVisitors(damageObject) {
        this.damageDealtVisitors.forEach((currVisitor) => {
            currVisitor.visitDamageObject(damageObject);
        });
        logFightingObject("Applied " + this.damageDealtVisitors.length + " damage dealt visitors.");
    }

    applyDamageReceivedVisitors(damageObject) {
        this.damageReceivedVisitors.forEach((currVisitor) => {
            currVisitor.visitDamageObject(damageObject);
        });
        logFightingObject("Applied " + this.damageReceivedVisitors.length + " damage dealt visitors.");
    }

    /**
     * @description final applying of damage object without any other calculations
     * @param {DamageObject} damageObject 
     */
    applyDamageObject(damageObject) {
        const oldHp = this.hp;
        this.hp -= damageObject.getResultingDamage();

        return oldHp - this.hp;
    }

    getBaseDamage() {
        return this.baseDamage;
    }

    getOwnerPosition() {
        return this.facade.getOwnerPosition();
    }

    getCurrentHP() {
        return this.hp;
    }

    /**
     * @description visitors ("modifiers") for dealt damage before dealing it and before other fighting object receives it
     * @param {DamageVisitor} visitor 
     */
    addDamageDealtVisitor(visitor) {
        this.damageDealtVisitors.push(visitor);
    }

    addDamageReceivedVisitor(visitor) {
        this.damageReceivedVisitors.push(visitor);
    }

    reset() {
        this.hp = this.maxHp;
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