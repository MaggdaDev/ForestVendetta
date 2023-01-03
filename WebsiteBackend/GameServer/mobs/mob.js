const FightingObject = require("../fighting/fightingObject");
const MovableBody = require("../physics/movableBody");
const PolygonHitBox = require("../physics/polygonHitBox");
const Vector = require("../../GameStatic/js/maths/vector");
const DropHandler = require("./dropHandler");
const TargetManager = require("./targetManager");

class Mob {
    constructor(hitBox, id, type, players,world, mobConfig, weaponManager) {
        this.hitBox = hitBox;
        this.id = id;
        this.movableBody = new MovableBody(hitBox, mobConfig.physics_stats.mass, this, id);
        this.movableBody.wayOutPriority = 50;
        this.movableBody.disableRotation();
        
        this.targetManager = new TargetManager(this,players,world);
        this.players = players;
        this.type = type;
        this.onUpdateHandlers = [];
        this.onDeathHandlers = [];

        this.shouldRemove = false;

        // fighting
        this.fightingObject = new FightingObject(mobConfig.fighting_stats.damage, mobConfig.fighting_stats.max_hp, this.id);
        this.fightingObject.addOnDamageTaken((damageTaken, damagePos, damageNormalAway)=>{
            this.movableBody.workForceOverTime(Vector.multiply(damageNormalAway, 30000),1);
        });

        // remove on dead
        this.addOnUpdate(()=>{
            this.checkAlive();
        });

        // drops
        this.dropHandler = new DropHandler(mobConfig.drop_config, weaponManager);
        this.addOnDeath(()=> {
            var dropObjects;    // []
            this.players.forEach((player)=>{
                dropObjects = this.dropHandler.createDrops();
                dropObjects.forEach((currDropObject)=>{
                    player.addDrop(currDropObject);
                });
            })
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
        throw new Error("To JSON not overridden for mob");
    }

    set pos(p) {
        this.hitBox.pos = p;
    }

    get pos() {
        return this.hitBox.pos;
    }
}

module.exports = Mob;