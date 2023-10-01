const FightingObject = require("../fighting/fightingObject");
const PolygonHitBox = require("../physics/polygonHitBox");
const Vector = require("../../GameStatic/js/maths/vector");
const Mob = require("./mob");
const FrogAbilityPerformer = require("../fighting/abilities/mobs/frogAbilityPerformer");
const FrogTongue = require("../projectiles/mobProjectiles/frogTongue");
const ProjectilesManager = require("../projectiles/projectilesManager");
const Protagonist = require("../player/protagonist");

class Frog extends Mob {
    static WIDTH = 200;
    static HEIGHT = 200;
    static MASS = 200;
    static JUMP_ANGLE = Math.PI / 30;
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
    constructor(x, y, id, players, world, frogConfig, variant, projectilesManager) {
        super(PolygonHitBox.fromRect(x, y, Frog.WIDTH, Frog.HEIGHT), id, "FROG", players, world, frogConfig, variant, FrogAbilityPerformer);
        this.projectilesManager = projectilesManager;

        this.movableBody.addGravity();
        this.movableBody.adjustJumpData({ jumpForce: Frog.JUMP_FORCE, angleAdjust: Frog.JUMP_ANGLE });

        this.addOnUpdate((t) => { this.onUpdate(t) });
        this.movableBody.addOnNewIntersectionWithPlayer((player, intersectionPoint) => this.onUsualPlayerIntersection(player, intersectionPoint));

        // abilities
        this.abilityPerformer = new FrogAbilityPerformer(this, this.mobConfig.ability_pool, this.mobConfig.abilities, variant);

        this.jumpForce = this.abilityPerformer.abilities.JUMP_ABILITY.jump_force;
        this.superJumpForce = this.abilityPerformer.abilities.SUPER_JUMP_ABILITY.jump_force;

        this.tongue = new FrogTongue(this, players, this.targetManager);
        projectilesManager.addProjectile(this.tongue);
        this.tongueTarget = null;
        this.eatTarget = null;
        this.spitGap = this.abilityPerformer.abilities.EAT_ABILITY.spit_gap;

        const instance = this;
        this.tongue.setOnTargetFound((player) => instance.onTargetFound(player));
        this.tongue.setOnPullStarted((player) => instance.onPullStarted(player));
        this.tongue.setOnPullFinished((player) => instance.onPullFinished(player));

    }

    onTargetFound(player) {
        this.tongueTarget = player;
        this.abilityPerformer.performAbilityNow("TONGUE_SLAP_ABILITY");
    }

    onPullStarted(player) {
        this.movableBody.addAlternativePlayerIntersectionHandler(player.id, (intersectedBody, intersections) => {
            this.tongue.playerHit(player);
            this.startEat(player);
            this.movableBody.removeAlternativePlayerIntersectionHandler(player.id);
        });
    }

    onPullFinished(player) {
        if(player === null) {
            this.abilityPerformer.setBusy(false);
        }
    }

    onUsualPlayerIntersection(player, intersectionPoint) {
        FightingObject.aDamageB(this.fightingObject, player.fightingObject, this.pos, player.pos, intersectionPoint);
    }

    /**
     * 
     * @param {Protagonist} player 
     */
    startEat(player) {
        this.eatTarget = player;
        this.abilityPerformer.performAbilityNow("EAT_ABILITY");
    }

    spitOutPlayer(player) {
        player.setDisabled(false);
        this.eatTarget = null;
        player.pos = Vector.add(this.pos, new Vector(0, -1 * (this.spitGap + (Frog.HEIGHT + Protagonist.PLAYER_HITBOX_HEIGHT) / 2.0)));
        this.abilityPerformer.performAbilityNow("SUPER_JUMP_ABILITY");
    }

    onUpdate(timeElapsed) {
        this.abilityPerformer.update(timeElapsed);
        if (this.eatTarget !== null) {
            this.eatTarget.pos = this.movableBody.pos;
        }
        if (this.movableBody.pos.abs > 10000) {
            this.movableBody.hitBox.pos = new Vector(500, 0);
            this.movableBody.spd = new Vector(0, 0);
        }
    }

    // ABILITIES: START
    JUMP_ABILITY() {
        console.log("Frog performing jump!");
        var airLine = this.targetManager.findNearestAirLine();
        if (airLine === null || airLine.x === 0) {
            this.movableBody.adjustJumpData({ angleAdjust: 0, jumpForce: this.jumpForce });
        } else if (airLine.x > 0) {
            this.movableBody.adjustJumpData({ angleAdjust: Frog.JUMP_ANGLE, jumpForce: this.jumpForce });
        } else {
            this.movableBody.adjustJumpData({ angleAdjust: -Frog.JUMP_ANGLE, jumpForce: this.jumpForce });
        }
        this.movableBody.wantToJumpOnce = true;
    }

    TONGUE_AIMING_ABILITY() {
        console.log("Frog performing aiming ability");
        this.abilityPerformer.setBusy(true);
        this.tongue.activateAiming();
        this.abilityPerformer.addOnAbilityExecutionFinished((isInterrupted) => {
            if(!isInterrupted) {
                this.abilityPerformer.setBusy(false);
                this.tongue.deactivate();
            }
        });
    }

    SUPER_JUMP_ABILITY() {
        console.log("Frog performing super jump!");
        this.movableBody.adjustJumpData({ angleAdjust: 0, jumpForce: this.superJumpForce });
        this.movableBody.wantToJumpOnce = true;
        this.abilityPerformer.addOnAbilityExecutionFinished((isInterrupted) => {
            this.abilityPerformer.setBusy(false);
        });
    }

    TONGUE_SLAP_ABILITY() {
        console.log("Performing tongue slap!");
        this.tongue.activateWithTarget(this.tongueTarget, () => {
            this.abilityPerformer.setBusy(false);
        });
    }

    EAT_ABILITY() {
        console.log("Frog performing eat ability");
        this.eatTarget.setDisabled(true);
        const instance = this;
        this.abilityPerformer.addOnAbilityExecutionFinished((isInterrupted) => {
            instance.spitOutPlayer(this.eatTarget);
        });
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
            acc: Vector.multiply(this.movableBody.resultingForce, 1.0 / this.movableBody.mass),
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