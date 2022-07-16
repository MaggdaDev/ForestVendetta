const Intersection = require("./intersection");
const MovableBody = require("./movableBody");
const Vector = require("./vector");

class PhysicalContact {

    /**
     * 
     * @param {MovableBody} body1 
     * @param {MovableBody} body2 
     * @param {Intersection} intersection1 
     * @param {Intersection} intersection2 
     */
    constructor(body1, body2, intersection1, intersection2) {
        this.body1 = body1;
        this.body2 = body2;
        this.intersection1 = intersection1;
        this.intersection2 = intersection2;
        this.intersectionCenter = Vector.center(intersection1.intersectionPoint, intersection2.intersectionPoint);
        this.intersectionLine = Vector.subtractFrom(intersection2.intersectionPoint, intersection1.intersectionPoint);
        this.normalDir = this.intersectionLine.normalDir;
        this.dir = this.intersectionLine.dirVec;
        this.pointInside;
        this.overlapForce = 10000;

    }

    get overlapTime() {
        var spdDiff = Vector.subtractFrom(this.body2.spd, this.body1.spd);
        var r1 = this.body1.hitBox.getDistToGravCenter(this.intersectionCenter);
        var r2 = this.body2.hitBox.getDistToGravCenter(this.intersectionCenter);
        var linSpd1 = Vector.crossWithOnlyZ(r1, (-1.0) * this.body1.rotSpd);
        var linSpd2 = Vector.crossWithOnlyZ(r2, (-1.0) * this.body2.rotSpd);
        var linSpdDiff = Vector.subtractFrom(linSpd2, linSpd1);
        var zaehler = Vector.add(linSpdDiff, spdDiff).abs;

        var coeffs = (1.0/this.body1.mass + 1.0/this.body2.mass + r1.abs * r1.abs / this.body1.inertiaMoment + r2.abs * r2.abs / this.body2.inertiaMoment) / 2.0;
        var force1Vec = Vector.getMoreSimilarTo(r1, Vector.multiply(this.normalDir, this.overlapForce));
        var coeffedForce = Vector.multiply(force1Vec, coeffs);
        var sub1 = Vector.multiply(r1, force1Vec.dot(r1)/(2.0 * this.body1.inertiaMoment));
        var sub2 = Vector.multiply(r2, force1Vec.dot(r2)/(2.0 * this.body2.inertiaMoment));
        var nenner = Vector.subtractFrom(Vector.subtractFrom(coeffedForce, sub1), sub2).abs;
        return zaehler/nenner;
    }

    moveBodyOut() {
        var info = this.pointInsideAndBodyToMove;
        var wayOut = this.getRouteToSlightlyOut(info.pointInside);
        info.bodyToMove.hitBox.moveOutOfHitBox(Vector.multiply(wayOut, 1));
        if(info.bodyToMove === this.body1) {
            this.body2.hitBox.moveOutOfHitBox(Vector.multiply(wayOut, -1));
        } else {
            this.body1.hitBox.moveOutOfHitBox(Vector.multiply(wayOut, -1));
        }
        console.log("Overlap time: " + this.overlapTime);
    }

    get pointInsideAndBodyToMove() {
        if(this.body2.hitBox.isPointInside(this.intersection1.segment2.from)) {
            return {pointInside: this.intersection1.segment2.from, bodyToMove: this.body1};
        } else if (this.body2.hitBox.isPointInside(this.intersection1.segment2.to)) {
            return {pointInside: this.intersection1.segment2.to, bodyToMove: this.body1};
        } else if(this.body1.hitBox.isPointInside(this.intersection1.segment1.from)) {
            return {pointInside: this.intersection1.segment1.from, bodyToMove: this.body2};
        } else if(this.body1.hitBox.isPointInside(this.intersection1.segment1.to)) {
            return {pointInside: this.intersection1.segment1.to, bodyToMove: this.body2};
        } else if(this.body2.hitBox.isPointInside(this.intersection2.segment2.from)) {
            return {pointInside: this.intersection2.segment2.from, bodyToMove: this.body1};
        } else if (this.body2.hitBox.isPointInside(this.intersection2.segment2.to)) {
            return {pointInside: this.intersection2.segment2.to, bodyToMove: this.body1};
        } else if(this.body1.hitBox.isPointInside(this.intersection2.segment1.from)) {
            return {pointInside: this.intersection2.segment1.from, bodyToMove: this.body2};
        } else if(this.body1.hitBox.isPointInside(this.intersection2.segment1.to)) {
            return {pointInside: this.intersection2.segment1.to, bodyToMove: this.body2};
        } 
        console.log("NO POINT INSIDE!");
    }

    /**
     * 
     * @param {Vector} pointIn 
     */
    getRouteToSlightlyOut(pointIn) {
        var out = Vector.multiply(this.normalDir, Vector.subtractFrom(this.intersection1.intersectionPoint, pointIn).dot(this.normalDir));
        out = Vector.multiply(out,1.1);
        return out;
    }

    /**
     * 
     * @param {Vector} vec 
     */
    getNormalPart(vec) {
        return Vector.multiply(this.normalDir, vec.dot(this.normalDir));
    }

    /**
     * 
     * @param {Vector} vec 
     */
    getParallelPart(vec) {
        return Vector.multiply(this.dir, vec.dot(this.dir));
    }
}

module.exports = PhysicalContact;
