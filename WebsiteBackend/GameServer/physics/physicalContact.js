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
        this.killCauseNoInt = false;

    }

    get overlapTime() {
        /* old
        var spdDiff = Vector.subtractFrom(this.body2.spd, this.body1.spd);
        var r1 = this.body1.hitBox.getPosRelToGravCenter(this.intersectionCenter);
        var r2 = this.body2.hitBox.getPosRelToGravCenter(this.intersectionCenter);
        var linSpd1 = Vector.crossWithOnlyZ(r1, (-1.0) * this.body1.rotSpd);
        var linSpd2 = Vector.crossWithOnlyZ(r2, (-1.0) * this.body2.rotSpd);
        var linSpdDiff = Vector.subtractFrom(linSpd2, linSpd1);
        var zaehler = Vector.add(linSpdDiff, spdDiff);

        var coeffs = (1.0 / this.body1.mass + 1.0 / this.body2.mass + r1.abs * r1.abs / this.body1.inertiaMoment + r2.abs * r2.abs / this.body2.inertiaMoment) / 2.0;
        var force1Vec = Vector.getMoreSimilarTo(Vector.multiply(r1, -1.0), Vector.multiply(this.normalDir, this.overlapForce));
        var coeffedForce = Vector.multiply(force1Vec, coeffs);
        var sub1 = Vector.multiply(r1, force1Vec.dot(r1) / (2.0 * this.body1.inertiaMoment));
        var sub2 = Vector.multiply(r2, force1Vec.dot(r2) / (2.0 * this.body2.inertiaMoment));
        var nenner = Vector.subtractFrom(Vector.subtractFrom(coeffedForce, sub1), sub2);
        return zaehler.abs / nenner.abs;
        */
        var r1 = this.body1.hitBox.getPosRelToGravCenter(this.intersectionCenter);
        var r2 = this.body2.hitBox.getPosRelToGravCenter(this.intersectionCenter);
        var force1Vec = Vector.getMoreSimilarTo(Vector.multiply(r1, -1.0), Vector.multiply(this.normalDir, this.overlapForce));

        var rotLinSpd1 = Vector.crossWithOnlyZ(r1, (-1.0) * this.body1.rotSpd);
        var rotLinSpd2 = Vector.crossWithOnlyZ(r2, (-1.0) * this.body2.rotSpd);
        var totSpd1 = Vector.add(this.body1.spd, rotLinSpd1);
        var totSpd2 = Vector.add(this.body2.spd, rotLinSpd2);
        var zaehler = force1Vec.dot(totSpd2) - force1Vec.dot(totSpd1);

        var coeffs = (1.0 / this.body1.mass + 1.0 / this.body2.mass + r1.abs * r1.abs / this.body1.inertiaMoment + r2.abs * r2.abs / this.body2.inertiaMoment);
        if(this.body1.rotationDisabled && this.body2.rotationDisabled) {
            coeffs = (1.0 / this.body1.mass + 1.0 / this.body2.mass);
        } else if(this.body1.rotationDisabled) {
            coeffs = (1.0 / this.body1.mass + 1.0 / this.body2.mass + r2.abs * r2.abs / this.body2.inertiaMoment);
        } else if(this.body2.rotationDisabled) {
            coeffs = (1.0 / this.body1.mass + 1.0 / this.body2.mass + r1.abs * r1.abs / this.body1.inertiaMoment);
        }
        var sum1 = 0.5 * force1Vec.abs * force1Vec.abs * coeffs; 
        var sub1 = Math.pow(force1Vec.dot(r1), 2.0) / (2.0 * this.body1.inertiaMoment);
        if(this.body1.rotationDisabled) {
            sub1 = 0;
        }
        var sub2 = Math.pow(force1Vec.dot(r2), 2.0) / (2.0 * this.body2.inertiaMoment);
        if(this.body2.rotationDisabled) {
            sub2 = 0;
        }
        var nenner = sum1 - sub1 - sub2;
        return 0.55 * zaehler / nenner;
    }

    moveBodyOut() {
        var info = this.pointInsideAndBodyToMove;
        if (info !== undefined) {
            var wayOut = this.getRouteToSlightlyOut(info.pointInside);
            info.bodyToMove.hitBox.moveOutOfHitBox(Vector.multiply(wayOut, 0.5));
            if (info.bodyToMove === this.body1) {
                this.body2.hitBox.moveOutOfHitBox(Vector.multiply(wayOut, -0.5));
            } else {
                this.body1.hitBox.moveOutOfHitBox(Vector.multiply(wayOut, -0.5));
            }
        }

    }

    moveAlmostOut() {
        var info = this.pointInsideAndBodyToMove;
        if (info !== undefined) {
            var wayOut = this.getRouteToSlightlyNotOut(info.pointInside);
            info.bodyToMove.hitBox.moveOutOfHitBox(Vector.multiply(wayOut, 0.5));
            if (info.bodyToMove === this.body1) {
                this.body2.hitBox.moveOutOfHitBox(Vector.multiply(wayOut, -0.5));
            } else {
                this.body1.hitBox.moveOutOfHitBox(Vector.multiply(wayOut, -0.5));
            }
        }

    }

    getOtherBody(thisBody) {
        if (thisBody === this.body1) {
            return this.body2;
        }
        if (thisBody === this.body2) {
            return this.body1;
        }
        console.error("OTHER NOT FOUND!");
    }

    get pointInsideAndBodyToMove() {
        var pointsInside = [];
        if (this.body2.hitBox.isPointInside(this.intersection1.segment2.from)) {
            pointsInside.push({ pointInside: this.intersection1.segment2.from, bodyToMove: this.body1 });
        } if (this.body2.hitBox.isPointInside(this.intersection1.segment2.to)) {
            pointsInside.push({ pointInside: this.intersection1.segment2.to, bodyToMove: this.body1 });
        } if (this.body1.hitBox.isPointInside(this.intersection1.segment1.from)) {
            pointsInside.push({ pointInside: this.intersection1.segment1.from, bodyToMove: this.body2 });
        } if (this.body1.hitBox.isPointInside(this.intersection1.segment1.to)) {
            pointsInside.push({ pointInside: this.intersection1.segment1.to, bodyToMove: this.body2 });
        } if (this.body2.hitBox.isPointInside(this.intersection2.segment2.from)) {
            pointsInside.push({ pointInside: this.intersection2.segment2.from, bodyToMove: this.body1});
        } if (this.body2.hitBox.isPointInside(this.intersection2.segment2.to)) {
            pointsInside.push({ pointInside: this.intersection2.segment2.to, bodyToMove: this.body1 });
        } if (this.body1.hitBox.isPointInside(this.intersection2.segment1.from)) {
            pointsInside.push({ pointInside: this.intersection2.segment1.from, bodyToMove: this.body2 });
        } if (this.body1.hitBox.isPointInside(this.intersection2.segment1.to)) {
            pointsInside.push({ pointInside: this.intersection2.segment1.to, bodyToMove: this.body2 });
        }
        var currMaxDist = 0;
        var curr = 0;
        var currBest = undefined;
        pointsInside.forEach((element)=>{
            curr = this.getRouteToSlightlyOut(element.pointInside).abs;
            if(curr >= currMaxDist) {
                currMaxDist = curr;
                currBest = element;
            }
        });
        return currBest;
        console.log("NO POINT INSIDE!");
    }

    shouldPersist() {
        if(this.killCauseNoInt) {
            console.log("kill cause no int!");
            return false;
        }
        var spd1 = Vector.add(this.body1.spd, Vector.crossWithOnlyZ(this.body1.hitBox.getPosRelToGravCenter(this.intersectionCenter), -this.body1.rotSpd));
        var spd2 = Vector.add(this.body2.spd, Vector.crossWithOnlyZ(this.body2.hitBox.getPosRelToGravCenter(this.intersectionCenter), -this.body2.rotSpd));
        var force1Comp = this.getNormalPart(this.body1.resultingForce);
        var force2Comp = this.getNormalPart(this.body2.resultingForce);
        var forceDiff = Vector.subtractFrom(force2Comp, force1Comp);
        if ((Vector.quasiSame(force1Comp, force2Comp) || Vector.sameSign(forceDiff, force2Comp))) { // Vector.subtractFrom(spd2, spd1).abs < 50 && 
            var midSpd = Vector.multiply(Vector.add(Vector.multiply(spd1, this.body1.mass), Vector.multiply(spd2, this.body2.mass)), 1.0/(this.body1.mass + this.body2.mass));
            //this.body1.spd.setTo(midSpd);
            //this.body2.spd.setTo(midSpd);
            console.log("Persist!");
            return true;
        } else {
            return false;
        }
    }


    /**
     * 
     * @param {Vector} pointIn 
     */
    getRouteToSlightlyOut(pointIn) {
        var out = Vector.multiply(this.normalDir, Vector.subtractFrom(this.intersection1.intersectionPoint, pointIn).dot(this.normalDir));
        out = Vector.add(out, Vector.multiply(out.dirVec, 0.01));
        return out;
    }

    getRouteToSlightlyNotOut(pointIn) {
        var out = Vector.multiply(this.normalDir, Vector.subtractFrom(this.intersection1.intersectionPoint, pointIn).dot(this.normalDir));
        //var out = Vector.subtractFrom(this.intersectionCenter, pointIn);
        var outDir = out.dirVec;
        if(out.x > 0) {
            out.x = Math.max(0, out.x - 2.0*outDir.x);
        } else {
            out.x = Math.min(0, out.x - 2.0*outDir.x);
        }
        if(out.y > 0) {
            out.y = Math.max(0, out.y - 2.0*outDir.y);
        } else {
            out.y = Math.min(0, out.y - 2.0*outDir.y);
        }
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
