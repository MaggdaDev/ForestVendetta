const PolygonHitBox = require("../../physics/polygonHitBox");
const Protagonist = require("../../player/protagonist");
const Projectile = require("../projectile");
const Vector = require("../../../GameStatic/js/maths/vector");
const MovableBody = require("../../physics/movableBody");
class FrogTongue extends Projectile {

    static TOP_ANCHOR_Y_OFFSET = 0;
    static BOT_ANCHOR_Y_OFFSET = 30;
    static TONGUE_SPEED = 1200;
    static MAX_RANGE = 2000;
    static MIN_RANGE = 300;
    /**
     * 
     * @param {Frog} owner 
     * @param {Protagonist[]} players
     */
    constructor(owner, players, targetManager) {
        const topAnchorPoint = new Vector(0, 0);
        const botAnchorPoint = new Vector(0, 0);
        const topEndPoint = new Vector(0, 0);
        const botEndPoint = new Vector(0, 0);
        super(owner, new PolygonHitBox([botAnchorPoint, topAnchorPoint, topEndPoint, botEndPoint]), Projectile.PROJECTILE_TYPES.FROG_TONGUE);
        this.topAnchorPoint = topAnchorPoint;
        this.botAnchorPoint = botAnchorPoint;
        this.topEndPoint = topEndPoint;
        this.botEndPoint = botEndPoint;
        this.owner = owner;
        this.targetManager = targetManager;

        this.targetData = {
            stopwatchSinceTarget: 0,
            targetPlayer: 0,
            playerYSpdAtTarget: 0,
            distToPeakAtTarget: 0
        }
        this.isAiming = false;
        this.length = 0;    // variable to control length
        this.dirVec = new Vector(1, 1).dirVec;
        const instance = this;
        super.addOnUpdate((timeElapsed) => instance.updateTongue(timeElapsed));

        this.players = players;
        super.setHitListener(players, (hitPlayers) => {
            for (var player of hitPlayers) {
                //player.die();
                //this.deactivate();
            }
        });

    }

    activateAiming() {
        this.isAlive = false;
        this.shouldUpdate = true;
        this.shouldRender = false;
        this.isAiming = true;
    }


    /**
     * @returns true, if ability was activated and false, if it is not activatable
     */
    activateIfPossible() {
        this.refreshPosToOwner();
        this.targetData.targetPlayer = null;
        var currHighestPrio = -1;
        this.players.forEach((currPlayer) => {
            const currPrio = this.calcTargetPlayerPriority(currPlayer);
            if (currPrio > currHighestPrio) {
                currHighestPrio = currPrio;
                this.targetData.targetPlayer = currPlayer;
            }
        });
        if (this.targetData.targetPlayer === null) {
            return false;
        }
        this.activateWithTarget(this.targetData.targetPlayer);
        return true;
    }

    /**
     * 
     * @param {Protagonist} player 
     */
    calcPlayerJumpPeakRelativeToFrog(player) {
        const tongueOrigin = this.calcTongueOrigin();
        const currPlayerX = player.pos.x - tongueOrigin.x;
        const currPlayerY = player.pos.y - tongueOrigin.y;
        const currPlayerSpdX = player.movableBody.spd.x;
        const currPlayerSpdY = player.movableBody.spd.y;
        const g = MovableBody.GRAVITY;

     return new Vector(currPlayerX - currPlayerSpdX * currPlayerSpdY / g,
            currPlayerY - 0.5 * currPlayerSpdY * currPlayerSpdY / g);
    }

    /**
     * @description refreshed tongue position and calculates origin
     * @returns 
     */
    calcTongueOrigin() {
        this.refreshPosToOwner();
        return Vector.mean([this.topAnchorPoint, this.botAnchorPoint])
    }

    /**
     * 
     * @param {Protagonist} player
     * @returns -1, if player cant be targetted, else: prio number 
     */
    calcTargetPlayerPriority(player) {
        const dist = this.calcDistToPeak(player);
        if (dist === 0) dist = 0.0001;
        if (dist > FrogTongue.MAX_RANGE || dist < FrogTongue.MIN_RANGE || this.calcFlightTime(0, dist, player.movableBody.spd.y) > 0) {
            return -1;
        }
        return dist;
    }

    calcDistToPeak(player) {
        return Math.max(0.001, this.calcPlayerJumpPeakRelativeToFrog(player).abs);
    }

    calcFlightTime(timeSinceTarget, distAtTarget, playerSpdYAtTarget) {
        return Math.min(Math.max(0, timeSinceTarget + (distAtTarget / FrogTongue.TONGUE_SPEED) - Math.abs(playerSpdYAtTarget / MovableBody.GRAVITY)), distAtTarget / FrogTongue.TONGUE_SPEED);
    }

    calcDirToPeak(player) {
        return this.calcPlayerJumpPeakRelativeToFrog(player).dirVec;
    }

    updateTongue(timeElapsed) {
        if (this.isAiming) {
            this.activateIfPossible();
        } else {
            this.targetData.stopwatchSinceTarget += timeElapsed;
            this.setLength(FrogTongue.TONGUE_SPEED * this.calcFlightTime(this.targetData.stopwatchSinceTarget, this.targetData.distToPeakAtTarget, this.targetData.playerYSpdAtTarget));
            console.log(this.calcFlightTime(this.targetData.stopwatchSinceTarget, this.targetData.distToPeakAtTarget, this.targetData.playerYSpdAtTarget));
            this.refreshPosToOwner();

            if (this.length > 2 * FrogTongue.MAX_RANGE) {
                this.deactivate();
            }
        }
    }

    refreshPosToOwner() {
        this.topAnchorPoint.x = this.owner.pos.x;
        this.topAnchorPoint.y = this.owner.pos.y + FrogTongue.TOP_ANCHOR_Y_OFFSET;

        this.botAnchorPoint.x = this.owner.pos.x;
        this.botAnchorPoint.y = this.owner.pos.y + FrogTongue.BOT_ANCHOR_Y_OFFSET;

        this.topEndPoint.setTo(Vector.add(this.topAnchorPoint, Vector.multiply(this.dirVec, this.length)));
        this.botEndPoint.setTo(Vector.add(this.botAnchorPoint, Vector.multiply(this.dirVec, this.length)));
    }

    setLength(length) {
        this.length = length;
    }

    deactivate() {
        this.setLength(0);
        this.shouldRender = false;
        this.shouldUpdate = false;
        this.isAlive = false;
    }

    activateWithTarget(player) {
        this.targetData.targetPlayer = player;
        this.targetData.stopwatchSinceTarget = 0;
        this.targetData.playerYSpdAtTarget = player.movableBody.spd.y;
        this.targetData.distToPeakAtTarget = this.calcDistToPeak(player);

        this.length = 0;
        this.dirVec = this.calcDirToPeak(player);
        super.isAlive = true;
        super.shouldRender = true;
        this.isAiming = false;
        super.shouldUpdate = true;
    }

    /**
     * OVERRIDE
     */
    extendJson(modifyableJson) {
        /*
        modifyableJson.topAnchorPoint = this.topAnchorPoint,
        modifyableJson.botAnchorPoint = this.botAnchorPoint,
        modifyableJson.topEndPoint = this.topEndPoint,
        modifyableJson.botEndPoint = this.botEndPoint
        */
        modifyableJson.points = this.hitBox.points;
    }


}

module.exports = FrogTongue;