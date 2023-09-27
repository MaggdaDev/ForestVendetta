const Frog = require("../../mobs/frog");
const PolygonHitBox = require("../../physics/polygonHitBox");
const Protagonist = require("../../player/protagonist");
const Projectile = require("../projectile");
const Vector = require("../../../GameStatic/js/maths/vector");
class FrogTongue extends Projectile {

    static TOP_ANCHOR_Y_OFFSET = 0;
    static BOT_ANCHOR_Y_OFFSET = 100;
    /**
     * 
     * @param {Frog} owner 
     * @param {Protagonist[]} players
     */
    constructor(owner, players, targetManager) {
        const topAnchorPoint = new Vector(0,0);
        const botAnchorPoint = new Vector(0,0);
        const topEndPoint = new Vector(0,0);
        const botEndPoint = new Vector(0,0);
        super(owner, new PolygonHitBox([botAnchorPoint, topAnchorPoint, topEndPoint, botEndPoint]), Projectile.PROJECTILE_TYPES.FROG_TONGUE);
        this.topAnchorPoint = topAnchorPoint;
        this.botAnchorPoint = botAnchorPoint;
        this.topEndPoint = topEndPoint;
        this.botEndPoint = botEndPoint;
        this.owner = owner;
        this.targetManager = targetManager;

        this.length = 0;    // variable to control length
        this.dirVec = new Vector(1,0);
        const instance = this;
        super.addOnUpdate((timeElapsed) => instance.updateTongue(timeElapsed));

        this.players = players;
        super.setHitListener(players, (hitPlayers) => {
            for (var player of hitPlayers) {
                    player.die();
                    this.deactivate();
            }
        });

    }

    updateTongue(timeElapsed) {
        this.setLength(this.length + timeElapsed * 300);
        this.refreshPosToOwner();

        if(this.length > 900) {
            this.deactivate();
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

    activate() {
        var airLine = this.targetManager.findNearestAirLine();
        if(airLine.x > 0) {
            this.dirVec.x = 1;
        } else {
            this.dirVec.x = -1;
        }
        this.length = 0;
        super.isAlive = true;
        super.shouldRender = true;
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