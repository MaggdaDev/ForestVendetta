const PolygonHitBox = require("../../physics/polygonHitBox");
const Protagonist = require("../../player/protagonist");
const Projectile = require("../projectile");
const Vector = require("../../../GameStatic/js/maths/vector");
const MovableBody = require("../../physics/movableBody");
const CustomForce = require("../../physics/customForce");

class FrogTongue extends Projectile {

    static TOP_ANCHOR_Y_OFFSET = 0;
    static BOT_ANCHOR_Y_OFFSET = 30;
    static TONGUE_SPEED = 1200;
    static MAX_RANGE = 2000;
    static MIN_RANGE = 400;
    static PULL_FORCE = 30;

    static STATES = {
        DEFAULT: "DEFAULT",
        AIMING: "AIMING",
        TARGET_FOUND: "TARGET_FOUND",
        SHOOTING: "SHOOTING",
        PULLING: "PULLING"
    }
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

        this.pullForce = this.setupPullForce();

        this.targetData = {
            countUpAndDownSinceTarget: 0,
            targetPlayer: 0,
            playerYSpdAtTarget: 0,
            distToPeakAtTarget: 0
        }

        this.pulledPlayer = null;
        this.state = FrogTongue.STATES.DEFAULT;
        this.length = 0;    // variable to control length
        this.dirVec = new Vector(1, 1).dirVec;
        const instance = this;
        super.addOnUpdate((timeElapsed) => instance.updateTongue(timeElapsed));

        this.players = players;
        super.setHitListener(players, (hitPlayers) => {
            var bestPrio = 0, currPrio = 0;
            var bestPlayer = null;
            for (var player of hitPlayers) {
                currPrio = this.calcTargetPlayerPriority(player);
                if (bestPlayer === null || currPrio > bestPrio) {
                    bestPlayer = player;
                    bestPrio = currPrio;
                }

            }
            this.activatePull(bestPlayer);
        });

        this.onPullFinished = null;
        this.onPullStarted = null;
        this.onTargetFound = null;

    }

    updateTongue(timeElapsed) {
        var flightTime;
        switch (this.state) {
            case FrogTongue.STATES.DEFAULT: case FrogTongue.TARGET_FOUND:
            // nothing!
            break;
            case FrogTongue.STATES.AIMING:
                this.searchForTarget();
                break;
            case FrogTongue.STATES.SHOOTING:
                this.targetData.countUpAndDownSinceTarget += timeElapsed;
                flightTime = this.calcFlightTime(this.targetData.countUpAndDownSinceTarget, this.targetData.distToPeakAtTarget, this.targetData.playerYSpdAtTarget);
                this.setLength(FrogTongue.TONGUE_SPEED * flightTime);

                if (flightTime >= this.calcMaxFlightTime(this.targetData.distToPeakAtTarget)) {
                    console.log("Max reached");
                    this.activatePull(null);
                }

                this.refreshPosToOwner();

                break;
            case FrogTongue.STATES.PULLING:
                this.targetData.countUpAndDownSinceTarget -= timeElapsed;
                flightTime = this.calcFlightTime(this.targetData.countUpAndDownSinceTarget, this.targetData.distToPeakAtTarget, this.targetData.playerYSpdAtTarget);
                this.setLength(FrogTongue.TONGUE_SPEED * flightTime);

                this.refreshPosToOwner();

                if (this.length <= 0) {
                    this.deactivate();
                    this.onPullFinished(null);
                }
                break;
        }
    }

    /**
     * 
     * @param {function(player)} handler 
     */
    setOnPullStarted(handler) {
        this.onPullStarted = handler;
    }

    /**
     * 
     * @param {function(Protagonist target)} handler onTargetFound
     */
    setOnTargetFound(handler) {
        this.onTargetFound = handler;
    }

    /**
     * 
     * @param {function({Protagonist})} handler nullable
     */
    setOnPullFinished(handler) {
        this.onPullFinished = handler;
    }

    setupPullForce() {
        const pullForce = new CustomForce();
        const instance = this;
        pullForce.getUpdatedForce = function (timeElapsed, movableBody) {
            const vecToTongue = Vector.subtractFrom(instance.calcTongueEnd(), movableBody.pos);
            return Vector.multiply(vecToTongue.dirVec, FrogTongue.PULL_FORCE * Math.pow(vecToTongue.abs, 2.0));
        }

        return pullForce;
    }

    activateAiming() {
        this.isAlive = false;
        this.shouldUpdate = true;
        this.shouldRender = false;
        this.state = FrogTongue.STATES.AIMING;
    }


    /**
     * @returns true, if ability was activated and false, if it is not activatable
     */
    searchForTarget() {
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
        this.state = FrogTongue.STATES.TARGET_FOUND;
        this.onTargetFound(this.targetData.targetPlayer);   // todo: state anderes als aiming
        return true;
    }

    /**
     * 
     * @param {Protagonist} player 
     */
    playerHit(player) {
        this.onPullFinished(player);
        this.deactivate();
    }

    /**
     * 
     * @param {Protagonist} player 
     */
    setPulledPlayer(player) {
        if (this.pulledPlayer !== undefined && this.pulledPlayer !== null) {
            this.pulledPlayer.movableBody.removeCustomForce(this.pullForce);
        }
        this.pulledPlayer = player;
        if (this.pulledPlayer !== null && this.pulledPlayer !== undefined) {
            player.movableBody.addCustomForce(this.pullForce);
        }
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

    calcTongueEnd() {
        this.refreshPosToOwner();
        return Vector.mean([this.topEndPoint, this.botEndPoint]);
    }
    /**
     * 
     * @param {Protagonist} player
     * @returns -1, if player cant be targetted, else: prio number 
     */
    calcTargetPlayerPriority(player) {
        const dist = this.calcDistToPeak(player);
        if (dist === 0) dist = 0.0001;
        if (dist > FrogTongue.MAX_RANGE || dist < FrogTongue.MIN_RANGE || this.calcFlightTime(0, dist, player.movableBody.spd.y, FrogTongue.SHOOTING) > 0) {
            return -1;
        }
        return dist;
    }

    calcDistToPeak(player) {
        return Math.max(0.001, this.calcPlayerJumpPeakRelativeToFrog(player).abs);
    }

    calcFlightTime(timeSinceTarget, distAtTarget, playerSpdYAtTarget) {
        return Math.min(Math.max(0, timeSinceTarget + (distAtTarget / FrogTongue.TONGUE_SPEED) - Math.abs(playerSpdYAtTarget / MovableBody.GRAVITY)), this.calcMaxFlightTime(distAtTarget));

    }

    calcMaxFlightTime(distAtTarget) {
        return 1.3 * distAtTarget / FrogTongue.TONGUE_SPEED;
    }

    calcDirToPeak(player) {
        return this.calcPlayerJumpPeakRelativeToFrog(player).dirVec;
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
        this.state = FrogTongue.STATES.DEFAULT;
        this.setPulledPlayer(null);
        this.shouldRender = false;
        this.shouldUpdate = false;
        this.isAlive = false;
    }

    activateWithTarget(player, onFinished) {
        this.targetData.targetPlayer = player;
        this.targetData.countUpAndDownSinceTarget = 0;
        this.targetData.playerYSpdAtTarget = player.movableBody.spd.y;
        this.targetData.distToPeakAtTarget = this.calcDistToPeak(player);

        this.length = 0;
        this.dirVec = this.calcDirToPeak(player);
        super.isAlive = true;
        super.shouldRender = true;
        this.state = FrogTongue.STATES.SHOOTING;
        super.shouldUpdate = true;
    }

    /**
     * 
     * @param {Protagonist} player nullable
     */
    activatePull(player) {
        this.state = FrogTongue.STATES.PULLING;
        this.setPulledPlayer(player);
        if (player !== null && this.onPullStarted !== null) {
            this.onPullStarted(player);
        }
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