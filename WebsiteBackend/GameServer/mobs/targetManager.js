const HitBox = require("../physics/hitbox");
const Segment = require("../physics/segment");
const Vector = require("../physics/vector");

class TargetManager {
    constructor(owner, players, world) {
        this.owner = owner;
        this.players = players;
        this.world = world;
    }

    findNearestAirLine() {
        var startPos = this.owner.pos;
        var bestAirLine = null;
        var currConn;
        this.players.forEach((currPlayer) => {
            currConn = Vector.subtractFrom(currPlayer.pos, startPos);
            if (bestAirLine === null || currConn.abs < bestAirLine.abs) {
                if (!this.doesAirLineIntersect(currConn)) {
                    bestAirLine = currConn;
                }
            }
        });
        return bestAirLine;
    }

    doesAirLineIntersect(airLine) {
        var airLineSeg = new Segment(this.owner.pos, Vector.add(this.owner.pos, airLine));
        var intersectables = this.world.intersectables;
        var currIntersectable;
        var intersections;
        for (var i = 0; i < intersectables.length; i++) {
            currIntersectable = intersectables[i];
            intersections = HitBox.getIntersections(currIntersectable.hitBox, airLineSeg);
            if (intersections !== null && intersections !== undefined) {
                console.log("Air line intersected!");
                return true;
            }
        }
        return false;

    }


}

module.exports = TargetManager;