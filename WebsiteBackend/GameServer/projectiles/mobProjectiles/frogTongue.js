const Frog = require("../../mobs/frog");
const PolygonHitBox = require("../../physics/polygonHitBox");
const Protagonist = require("../../player/protagonist");
const Projectile = require("../projectile");
const Vector = require("../../../GameStatic/js/maths/vector");
class FrogTongue extends Projectile{
    /**
     * 
     * @param {Frog} owner 
     * @param {Protagonist[]} players
     */
    constructor(owner, players) {
        super(owner, new PolygonHitBox([Vector.clone(owner.pos), Vector.clone(owner.pos), Vector.clone(owner.pos), Vector.clone(owner.pos)]));

        const instance = this;
        super.addOnUpdate((timeElapsed) => {
            instance.hitBox.points[0].x += timeElapsed * 100;
            instance.hitBox.points[1].x -= timeElapsed * 100;

            for(var i = 0; i < 4; i += 1) {
                instance.hitBox.points[i].y = owner.pos.y;
            }
        });

        this.players = players;
        super.setHitListener(players, (hitPlayers) => {
            for(var player of hitPlayers) {
                player.die();
            }
        });

    }

    activate() {
        super.isAlive = true;
    }


}

module.exports = FrogTongue;