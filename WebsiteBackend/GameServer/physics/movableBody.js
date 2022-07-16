const HitBox = require("./hitbox");
const PhysicalContact = require("./physicalContact");
const Vector = require("./vector");

class MovableBody {

    /**
     * 
     * @param {HitBox} hitBox - the hitbox
     * @param {Vector} hitBox.pos - the position to change
     * @param {number} mass
     */
    constructor(hitBox, isElastic, mass) {
        this.hitBox = hitBox;
        this.acc = new Vector(0, 0);
        this.resultingForce = new Vector(0, 0);
        this.intersections = new Set();
        this.isElastic = isElastic;
        this.mass = mass;
        this.spd = new Vector(0, 0);
        this.rot = 0;
        this.rotSpd = 0;
        this.rotAcc = 0;


        this.isGravity = false;
        this.gravity = new Vector(0, 80);

        this.isRubberPoint = false;
        this.rubberPoint = null;
        this.rubberMult = 2000;
        this.rubberData = {f: 1, zeta: 0.05};

        this.isFriction = false;
        this.frictionMult = 0.2;

        this.inertiaMoment = this.mass * 20000;
    }

    addGravity() {
        this.isGravity = true;
    }

    addRubberPoint(rubberPoint) {
        this.isRubberPoint = true;
        this.rubberPoint = rubberPoint;
    }

    addFriction() {
        this.isFriction = true;
    }

    refreshResultingForce(timeElapsed) {
        this.resultingForce.clear();

        if (this.isGravity) {
            this.resultingForce.incrementBy(Vector.multiply(this.gravity, this.mass));
        }

        if (this.isRubberPoint) {
            var abstand = Vector.subtractFrom(this.rubberPoint, this.hitBox.pos).abs;

            //this.rubberData.zeta = 1/Math.max(0.5,abstand);
            //this.rubberData.f = 17/Math.max(10,abstand);
            var res = Vector.subtractFrom(Vector.subtractFrom(this.rubberPoint, this.hitBox.pos), Vector.multiply(this.spd, this.rubberData.zeta/(this.rubberData.f*Math.PI)));
            res = Vector.multiply(res, 2.0 * this.mass * Math.pow(Math.PI * this.rubberData.f, 2.0));
            this.resultingForce.incrementBy(res);
            var leftCtrl = Math.pow(Math.PI * this.rubberData.f,2.0);
            var rightCtrl = timeElapsed * this.rubberData.zeta/(2 * Math.PI * this.rubberData.f);
            if(rightCtrl > leftCtrl) {
                console.log("EIGENVALUES");
            }

            this.rotAcc = -10 * this.rot - 0.2 * this.rotSpd;
        }

        if (this.isFriction) {
            this.resultingForce.incrementBy(Vector.multiply(this.spd, -1 * this.frictionMult));
        }
    }

    workForceOverTime(force, time) {
        this.spd.incrementBy(Vector.multiply(force, time / this.mass));
    }

    workRotMomentOverTime(moment, time) {
        this.rotSpd += time * moment / this.inertiaMoment;
    }

    /**
     * 
     * @param {Vector} direction 
     * @param {number} desiredSpeed 
     * @param {number} acceleration 
     */
    generateAccelerateImpulse(direction, desiredSpeed, acceleration) {
        var impStart = Vector.multiply(direction.dirVec, acceleration);
        var instance = this;
        function calcAccImpX() {
            var directedDesiredSpd = direction.x * desiredSpeed;
            if (Math.abs(directedDesiredSpd) < Math.abs(instance.spd.x)) {
                return 0;
            }
            var spdDiff = Math.abs((directedDesiredSpd - instance.spd.x) / directedDesiredSpd);
            return spdDiff * acceleration * direction.x;
        }
        function calcAccImpY() {
            var directedDesiredSpd = direction.y * desiredSpeed;
            if (Math.abs(directedDesiredSpd) < Math.abs(instance.spd.y) || directedDesiredSpd === 0) {
                return 0;
            }
            var spdDiff = Math.abs((directedDesiredSpd - instance.spd.y) / directedDesiredSpd);
            return spdDiff * acceleration * direction.y;
        }
        var accImp = new ComputingVector(impStart.x, impStart.y, calcAccImpX, calcAccImpY);
        this.acc.addVector(accImp);
        return accImp;
    }




    /**
     * 
     * @param {number} timeElapsed - in seconds 
     * @param {Set[MovableBody]} intersectables 
     */
    update(timeElapsed, intersectables) {
        this.checkIntersections(intersectables);
        this.refreshResultingForce(timeElapsed);
        this.acc = Vector.multiply(this.resultingForce, 1 / this.mass);
        this.spd.incrementBy(Vector.multiply(this.acc, timeElapsed));
        this.hitBox.pos = this.hitBox.pos.incrementBy(Vector.multiply(this.spd, timeElapsed));

        this.rotSpd += this.rotAcc * timeElapsed;
        this.rot += this.rotSpd * timeElapsed;
        this.hitBox.updateRot(this.rot);

    }

    checkIntersections(intersectables) {
        intersectables.forEach(element => {
            if (element != this) {
                var newIntersections = HitBox.getIntersections(element.hitBox, this.hitBox);
                if (newIntersections != null && (!this.intersections.has(element))) {
                    console.log("INTERSECTION!");
                    this.intersections.add(element);
                    element.intersections.add(this);
                    this.notifyNewIntersection(element, newIntersections);
                } else if (newIntersections != null && this.intersections.has(element)) {
                    console.log("moving out didnt work!");
                }
                else {
                    if (this.intersections.has(element)) {
                        this.intersections.delete(element);
                        element.intersections.delete(this);
                        this.notifyEndIntersection(element);
                    }
                }


            }

        });
    }

    notifyNewIntersection(object, newIntersections) {
        var contact = new PhysicalContact(this, object, newIntersections[0], newIntersections[1]);
        if (this.isElastic && object.isElastic) {
            console.log("Both elastic!");
            var overLapTime = contact.overlapTime;
            var thisForce = Vector.multiply(Vector.getMoreSimilarTo(this.hitBox.getDistToGravCenter(contact.intersectionCenter), contact.normalDir), contact.overlapForce);
            var otherForce = Vector.multiply(Vector.getMoreSimilarTo(object.hitBox.getDistToGravCenter(contact.intersectionCenter), contact.normalDir), contact.overlapForce);
            this.workForceOverTime(thisForce, overLapTime);
            object.workForceOverTime(otherForce, overLapTime);

            //var isThisClockwise = Vector.areClockwise(this.hitBox.pos, contact.intersectionCenter, Vector.add(contact.intersectionCenter, thisForceDir));
            //var isOtherClockwise = Vector.areClockwise(other.hitBox.pos, contact.intersectionCenter, Vector.add(contact.intersectionCenter, otherForceDir));

            var thisRotMoment = Vector.zOfCross(this.hitBox.getDistToGravCenter(contact.intersectionCenter),thisForce);
            var otherRotMoment = Vector.zOfCross(object.hitBox.getDistToGravCenter(contact.intersectionCenter),otherForce);
            this.workRotMomentOverTime(-thisRotMoment, overLapTime);
            object.workRotMomentOverTime(-otherRotMoment, overLapTime);
        }
        contact.moveBodyOut();
    }

    notifyEndIntersection(object) {

    }


}

module.exports = MovableBody;