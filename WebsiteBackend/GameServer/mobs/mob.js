const FightingObject = require("../fighting/fightingObject");
const MovableBody = require("../physics/movableBody");
const PolygonHitBox = require("../physics/polygonHitBox");
const Vector = require("../physics/vector");
const TargetManager = require("./targetManager");

class Mob {
    constructor(hitBox, id, type, players,world, frogConfig) {
        this.hitBox = hitBox;
        this.id = id;
        this.movableBody = new MovableBody(hitBox, frogConfig.physics_stats.mass, this, id);
        this.movableBody.wayOutPriority = 50;
        this.movableBody.disableRotation();
        
        this.targetManager = new TargetManager(this,players,world);
        this.players = players;
        this.type = type;
        this.onUpdateHandlers = [];
        this.onDeathHandlers = [];

        this.shouldRemove = false;

        // fighting
        this.fightingObject = new FightingObject(frogConfig.fighting_stats.damage, frogConfig.fighting_stats.max_hp, this.id);
        this.fightingObject.addOnDamageTaken((damageTaken, damagePos, damageNormalAway)=>{
            this.movableBody.workForceOverTime(Vector.multiply(damageNormalAway, 30000),1);
        });

        // remove on dead
        this.addOnUpdate(()=>{
            this.checkAlive();
        });


       
    }

    addOnDeath(handler) {
        this.onDeathHandlers.push(handler);
    }

    checkAlive() {
        if(!this.fightingObject.isAlive()) {
            this.remove();
            this.onDeathHandlers.forEach((curr)=>{
                curr();
            });
        }
    }

    remove() {
        this.shouldRemove = true;
    }

    update(timeElapsed, worldIntersectables, mobIntersectables, playerIntersectables) {
        this.movableBody.update(timeElapsed, worldIntersectables.concat(mobIntersectables).concat(playerIntersectables));
        this.onUpdateHandlers.forEach((element)=>{
            element(timeElapsed);
        });
    }

    addOnUpdate(handler) {
        this.onUpdateHandlers.push(handler);
    }

    /**
     * OVERRIDE
     */
     toJSON() {
        var instance = this;
        return {
            pos: instance.hitBox.pos,
            spd: instance.movableBody.spd,
            id: instance.id,
            isContact: instance.movableBody.isContact,
            type: instance.type,
            fightingObject: this.fightingObject
        }
    }

    set pos(p) {
        this.hitBox.pos = p;
    }

    get pos() {
        return this.hitBox.pos;
    }
}

module.exports = Mob;