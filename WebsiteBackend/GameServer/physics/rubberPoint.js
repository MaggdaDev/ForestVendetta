const Vector = require("../../GameStatic/js/maths/vector");

class RubberPoint {

    constructor(pos, center, zeta, f) {
        this.destinationPos = pos.clone();
        var distToCenter = Vector.subtractFrom(pos, center);
        this.attackPointDistToCenter = distToCenter.abs;
        this.attackPointAngToCenter = Math.atan2(distToCenter.y, distToCenter.x);

        this.zeta = zeta;
        this.f = f;
    }

    getAttackPoint(currCenter, currRot) {
        var dist = new Vector(this.attackPointDistToCenter * Math.cos(this.attackPointAngToCenter + currRot), this.attackPointDistToCenter * Math.sin(this.attackPointAngToCenter + currRot));
        return Vector.add(currCenter, dist);
    }

    getForce(currCenter, currRot, mass, spd, timeElapsed) {
        var attackPoint = this.getAttackPoint(currCenter, currRot);
        var res = Vector.subtractFrom(Vector.subtractFrom(this.destinationPos, attackPoint), Vector.multiply(spd, this.zeta / (this.f * Math.PI)));
        res = Vector.multiply(res, 2.0 * mass * Math.pow(Math.PI * this.f, 2.0));

        var leftCtrl = Math.pow(Math.PI * this.f, 2.0);
        var rightCtrl = timeElapsed * this.zeta / (2 * Math.PI * this.f);
        if (rightCtrl > leftCtrl) {
            console.log("EIGENVALUES");
        }
        return res;
    }
}

module.exports = RubberPoint;