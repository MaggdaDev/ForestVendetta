const FightingObject = require("../fighting/fightingObject");
const MovableBody = require("../physics/movableBody");
const PolygonHitBox = require("../physics/polygonHitBox");
const TargetManager = require("./targetManager");

class Mob {
    constructor(hitBox, mass, id, type, players,world, dmg, hp) {
        this.hitBox = hitBox;
        this.id = id;
        this.movableBody = new MovableBody(hitBox, mass, this, id);
        this.movableBody.wayOutPriority = 50;
        this.movableBody.disableRotation();
        
        this.targetManager = new TargetManager(this,players,world);
        this.players = players;
        this.type = type;
        this.onUpdateHandlers = [];

        this.shouldRemove = false;

        // fighting
        this.fightingObject = new FightingObject(dmg, hp, this.id);

        // remove on dead
        this.addOnUpdate(()=>{
            this.checkAlive();
        });
    }

    checkAlive() {
        if(!this.fightingObject.isAlive()) {
            this.remove();
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