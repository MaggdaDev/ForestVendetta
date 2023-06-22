const FightingObject = require("../fighting/fightingObject");
const MovableBody = require("../physics/movableBody");
const PolygonHitBox = require("../physics/polygonHitBox");
const Vector = require("../../GameStatic/js/maths/vector");
const DropHandler = require("./dropHandler");
const TargetManager = require("./targetManager");
const HitBox = require("../physics/hitbox");
const FacadeForFightingObject = require("../fighting/facadeForFightingObject");
const Stats = require("../../GameStatic/js/gameplay/stats/stats");

class Mob {
    /**
     * 
     * @param {HitBox} hitBox 
     * @param {string} id 
     * @param {*} type 
     * @param {*} players 
     * @param {*} world 
     * @param {*} mobConfig 
     * @param {string} variant - variant from gameplay config
     */
    constructor(hitBox, id, type, players,world, mobConfig, variant, AbilityPerformerClass) {
        // apply variant
        mobConfig = this.insertVariantIntoConfig(type, mobConfig, variant)
        
        this.hitBox = hitBox;
        this.mobConfig = mobConfig;
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

        // stats
        this.stats = Stats.fromConfigJson(mobConfig.fighting_stats);

        // fighting
        const fightingObjectFacade = new FacadeForFightingObject();
        fightingObjectFacade.getOwnerPosition = ()=> {
            return this.pos;
        };
        fightingObjectFacade.getOwnerStats = () => {
            return this.stats;
        };
        this.fightingObject = new FightingObject(fightingObjectFacade, this.id);
        this.fightingObject.addOnDamageTaken((damageTaken, damagePos, damageNormalAway)=>{
            this.movableBody.workForceOverTime(Vector.multiply(damageNormalAway, 30000),1);
        });

        // remove on dead
        this.addOnUpdate(()=>{
            this.checkAlive();
        });

        // drops
        this.dropHandler = new DropHandler(mobConfig.drop_config);
        this.addOnDeath(()=> {
            var dropObjects;    // []
            this.players.forEach((player)=>{
                const modifier = player.getDropProbabilityModifier();
                console.log("Drop modifier: " + modifier);
                dropObjects = this.dropHandler.createDrops(player.getDropProbabilityModifier());
                dropObjects.forEach((currDropObject)=>{
                    player.addDrop(currDropObject, this.movableBody.pos);
                });
            })
        });  

        // abilities
        this.abilityPerformer = new AbilityPerformerClass(this, this.mobConfig.ability_pool, this.mobConfig.abilities, variant);
    }

    insertVariantIntoConfig(type, mobConfig, variant) {
        if(variant === undefined) {
            variant = Mob.pickRandomType(Object.getOwnPropertyNames(mobConfig.variants));
            console.log("No variant given; spawning " + type + " with random variant: " + variant);
        }
        if(mobConfig.variants[variant] === undefined) {
            throw "Unsupported variant '" + variant + "' for " + type;
        }

        return Object.assign(mobConfig, mobConfig.variants[variant]);
    }

    getRarity() {
        if(this.mobConfig.rarity === undefined) {
            throw "Mob rarity for " + this.type + " not defined in config!";
        }
        return this.mobConfig.rarity;
    }

    static pickRandomType(types) {
        const ran = Math.random();
        for(var i = 0; i < types.length; i += 1) {
            if(ran <= (1+i)/(types.length)) {
                return types[i];
            }
        }
        throw "Random type major not working"
    }

    /**
     * @description called on first checkAlive negative
     * @param {function()} handler 
     */
    addOnDeath(handler) {
        this.onDeathHandlers.push(handler);
    }

    /**
     * @description called in the moment HP sinks under 0
     * @param {function(killerID)} handler 
     */
    addOnKilled(handler) {
        this.fightingObject.addOnDeath(handler);
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

    getMobConfig() {
        return this.mobConfig;
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