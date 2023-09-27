const FightingObject = require("../fighting/fightingObject");
const PolygonHitBox = require("../physics/polygonHitBox");
const Vector = require("../../GameStatic/js/maths/vector");
const Mob = require("./mob");
const FrogAbilityPerformer = require("../fighting/abilities/mobs/frogAbilityPerformer");
const FrogTongue = require("../projectiles/mobProjectiles/frogTongue");
const ProjectilesManager = require("../projectiles/projectilesManager");

class Frog extends Mob{
    static WIDTH = 200;
    static HEIGHT = 200;
    static MASS = 200;
    static JUMP_ANGLE = Math.PI/30;
    static JUMP_FORCE = 150000;
    
    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} id 
     * @param {*} players 
     * @param {*} world 
     * @param {*} frogConfig 
     * @param {*} variant 
     * @param {ProjectilesManager} projectilesManager 
     */
    constructor(x,y,id,players,world, frogConfig, variant, projectilesManager) {
        super(PolygonHitBox.fromRect(x,y,Frog.WIDTH,Frog.HEIGHT), id, "FROG",players,world, frogConfig, variant, FrogAbilityPerformer);
        this.projectilesManager = projectilesManager;

        this.movableBody.addGravity();
        this.movableBody.adjustJumpData({jumpForce: Frog.JUMP_FORCE, angleAdjust: Frog.JUMP_ANGLE});

        this.addOnUpdate((t)=>{this.onUpdate(t)});
        this.movableBody.addOnNewIntersectionWithPlayer((player, intersectionPoint)=>this.onPlayerIntersection(player, intersectionPoint));
        
        // abilities
        this.abilityPerformer = new FrogAbilityPerformer(this, this.mobConfig.ability_pool, this.mobConfig.abilities, variant);
        this.tongue = new FrogTongue(this, players, this.targetManager);
        projectilesManager.addProjectile(this.tongue);
        
    }

    onPlayerIntersection(player, intersectionPoint) {
        FightingObject.aDamageB(this.fightingObject, player.fightingObject, this.pos, player.pos, intersectionPoint);
    }

    onUpdate(timeElapsed) {
        this.abilityPerformer.update(timeElapsed);
        if(this.movableBody.pos.abs > 10000) {
            this.movableBody.hitBox.pos = new Vector(500, 0);
            this.movableBody.spd = new Vector(0,0);
        }

        this.tongue.update(timeElapsed);
    }

    // ABILITIES: START
    JUMP_ABILITY() {
        console.log("Frog performing jump!");
        var airLine = this.targetManager.findNearestAirLine();
        if(airLine === null || airLine.x === 0) {
            this.movableBody.adjustJumpData({angleAdjust: 0});
        } else if(airLine.x > 0) {
            this.movableBody.adjustJumpData({angleAdjust: Frog.JUMP_ANGLE});
        } else {
            this.movableBody.adjustJumpData({angleAdjust: -Frog.JUMP_ANGLE});
        }
        this.movableBody.wantToJumpOnce = true;
    }

    TONGUE_SLAP_ABILITY() {
        console.log("Performing tongue slap!");
        this.tongue.activate();
    }

    // ABILITIES: END

    /**
     * OVERRIDE
     */
     toJSON() {
        var instance = this;
        return {
            pos: instance.hitBox.pos,
            spd: instance.movableBody.spd,
            acc: Vector.multiply(this.movableBody.resultingForce, 1.0/this.movableBody.mass),
            id: instance.id,
            isContact: instance.movableBody.isContact,
            type: instance.type,
            width: Frog.WIDTH,
            height: Frog.HEIGHT,
            fightingObject: this.fightingObject,
            rarity: this.mobConfig.rarity
        }
    }
}

module.exports = Frog;