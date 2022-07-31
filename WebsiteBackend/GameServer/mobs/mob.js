const FightingObject = require("../fighting/fightingObject");
const MovableBody = require("../physics/movableBody");
const PolygonHitBox = require("../physics/polygonHitBox");
const TargetManager = require("./targetManager");

class Mob {
    constructor(hitBox, mass, id, type, players,world, dmg, hp) {
        this.hitBox = hitBox;
        this.id = id;
        this.movableBody = new MovableBody(hitBox, mass, this, "M" + id);
        this.movableBody.wayOutPriority = 50;
        this.movableBody.disableRotation();
        
        this.targetManager = new TargetManager(this,players,world);
        this.players = players;
        this.type = type;
        this.onUpdateHandlers = [];

        // fighting
        this.fightingObject = new FightingObject(dmg, hp);
    }

    update(timeElapsed, worldIntersectables) {
        this.movableBody.update(timeElapsed, worldIntersectables.concat(this.playerIntersectables));
        this.onUpdateHandlers.forEach((element)=>{
            element(timeElapsed);
        });
    }

    get playerIntersectables() {
        var ret = [];
        this.players.forEach((p)=>{
            ret.push(p.movableBody);
        })
        return ret;
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
            type: instance.type
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