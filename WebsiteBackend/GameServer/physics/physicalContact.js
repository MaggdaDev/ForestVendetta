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
        this.intersectionLine = Vector.subtractFrom(intersection2.intersectionPoint, intersection1.intersectionPoint);
        this.normalDir = this.intersectionLine.normalDir;
        this.dir = this.intersectionLine.dirVec;
        this.pointInside;
        this.overlapForce = 10000;

    }

    get overlapTime() {
        var zaehler = Vector.subtractFrom(this.body2.spd, this.body1.spd).abs;
        var nenner = (this.overlapForce/2.0) * (1.0/this.body1.mass + 1.0/this.body2.mass);
        return zaehler/nenner;
    }

    moveBodyOut() {
        var info = this.pointInsideAndBodyToMove;
        var wayOut = this.getRouteToSlightlyOut(info.pointInside);
        info.bodyToMove.hitBox.moveOutOfHitBox(wayOut);
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
        out = Vector.multiply(out, 1.01);
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
