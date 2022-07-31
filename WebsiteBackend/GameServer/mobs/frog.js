const FightingObject = require("../fighting/fightingObject");
const PolygonHitBox = require("../physics/polygonHitBox");
const Vector = require("../physics/vector");
const Mob = require("./mob");

class Frog extends Mob{
    static WIDTH = 200;
    static HEIGHT = 200;
    static MASS = 200;
    static TIME_BETWEEN_JUMPS = 5;
    static JUMP_ANGLE = Math.PI/30;
    static JUMP_FORCE = 150000;

    //fighting
    static DAMAGE = 5;
    static HP = 50;
    constructor(x,y,id,players,world) {
        super(PolygonHitBox.fromRect(x,y,Frog.WIDTH,Frog.HEIGHT), Frog.MASS, id, "FROG",players,world, Frog.DAMAGE, Frog.HP);
        this.movableBody.addGravity();
        

        this.timeSinceLastJump = 0;
        this.movableBody.adjustJumpData({jumpForce: Frog.JUMP_FORCE, angleAdjust: Frog.JUMP_ANGLE});

        this.addOnUpdate((t)=>{this.onUpdate(t)});
        this.movableBody.addOnNewIntersectionWithPlayer((player)=>this.onPlayerIntersection(player));
    }

    onPlayerIntersection(player) {
        FightingObject.aDamageB(this.fightingObject, player.fightingObject);
    }

    onUpdate(timeElapsed) {
        this.updateTimers(timeElapsed);
    }

    updateTimers(timeElapsed) {
        // Jumping
        this.timeSinceLastJump += timeElapsed;
        if(this.timeSinceLastJump >= Frog.TIME_BETWEEN_JUMPS) {
            this.jump();
            this.timeSinceLastJump = 0;
        }
    }

    jump() {
        var airLine = this.targetManager.findNearestAirLine();
        if(airLine === null || airLine.x === 0) {
            this.movableBody.adjustJumpData({angleAdjust: 0});
        } else if(airLine.x > 0) {
            this.movableBody.adjustJumpData({angleAdjust: Frog.JUMP_ANGLE});
        } else {
            this.movableBody.adjustJumpData({angleAdjust: -Frog.JUMP_ANGLE});
        }
        this.movableBody.wantToJump = true;
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
            width: Frog.WIDTH,
            height: Frog.HEIGHT
        }
    }
}

module.exports = Frog;