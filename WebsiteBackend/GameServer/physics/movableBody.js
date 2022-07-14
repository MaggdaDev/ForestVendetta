const ComputingVector = require("./computingVector");
const HitBox = require("./hitbox");
const MultiBodySystem = require("./multiBodySystem");
const PhysicalContact = require("./physicalContact");
const Vector = require("./vector");
const VectorSum = require("./vectorSum");

class MovableBody {

    /**
     * 
     * @param {HitBox} hitBox - the hitbox
     * @param {Vector} hitBox.pos - the position to change
     * @param {number} mass
     */
    constructor(hitBox, isElastic, mass) {
        this.hitBox = hitBox;
        this.acc = new VectorSum();
        this.intersections = new Set();
        this.isElastic = isElastic;
        this.mass = mass;
        this.currSystem = new MultiBodySystem(this, new Vector(0, 0));
    }

    addGravity() {
        this.gravity = new Vector(0, 40);
        this.acc.addVector(this.gravity);
    }

    addRubberPoint(rubberPoint) {
        var instance = this;
        this.acc.addVector(new ComputingVector(0, 0, () => { return rubberPoint.x - instance.hitBox.pos.x }, () => { return (rubberPoint.y - instance.hitBox.pos.y)*2 }));
    }

    addFriction() {
        var spd = (this.currSystem.sharedSpd);
        this.friction = new ComputingVector(0, 0, () => { return Math.sign(spd.x) * (-30) }, () => { return Math.sign(spd.y) * (-30) });
        this.acc.addVector(this.friction);
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
            if (Math.abs(directedDesiredSpd) < Math.abs(instance.currSystem.sharedSpd.x)) {
                return 0;
            }
            var spdDiff = Math.abs((directedDesiredSpd - instance.currSystem.sharedSpd.x) / directedDesiredSpd);
            return spdDiff * acceleration * direction.x;
        }
        function calcAccImpY() {
            var directedDesiredSpd = direction.y * desiredSpeed;
            if (Math.abs(directedDesiredSpd) < Math.abs(instance.currSystem.sharedSpd.y) || directedDesiredSpd === 0) {
                return 0;
            }
            var spdDiff = Math.abs((directedDesiredSpd - instance.currSystem.sharedSpd.y) / directedDesiredSpd);
            return spdDiff * acceleration * direction.y;
        }
        var accImp = new ComputingVector(impStart.x, impStart.y, calcAccImpX, calcAccImpY);
        this.acc.addVector(accImp);
        return accImp;
    }

    removeAcceleration(accToRemove) {
        this.acc.removeVector(accToRemove);
    }



    /**
     * 
     * @param {number} timeElapsed - in seconds 
     * @param {Set[MovableBody]} intersectables 
     */
    update(timeElapsed, intersectables) {
        this.checkIntersections(intersectables);
        this.currSystem.addWeightedSpd(Vector.multiply(this.acc, timeElapsed), this.mass);
        this.hitBox.pos = this.hitBox.pos.incrementBy(Vector.multiply(this.currSystem.sharedSpd, timeElapsed));

    }

    checkIntersections(intersectables) {
        intersectables.forEach(element => {
            if (element != this ) {
                var newIntersections = HitBox.getIntersections(element.hitBox, this.hitBox);
                if (newIntersections != null && (!this.intersections.has(element))) {
                    this.intersections.add(element);
                    element.intersections.add(this);
                    this.notifyNewIntersection(element, newIntersections);
                } else if(newIntersections != null && this.intersections.has(element)) {
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
            var thisSpd = this.currSystem.sharedSpd.clone();
            var thisNormalComp = contact.getNormalPart(thisSpd);
            var otherSpd = object.currSystem.sharedSpd.clone();
            var otherNormalComp = contact.getNormalPart(otherSpd);
            var newThisSpd = Vector.add(Vector.subtractFrom(thisSpd, thisNormalComp), otherNormalComp);
            var newOtherSpd = Vector.add(Vector.subtractFrom(otherSpd, otherNormalComp), thisNormalComp);
            this.currSystem.sharedSpd.x = newThisSpd.x;
            this.currSystem.sharedSpd.y = newThisSpd.y;
            object.currSystem.sharedSpd.x = newOtherSpd.x;
            object.currSystem.sharedSpd.y = newOtherSpd.y;
        } else {
            this.currSystem.addBody(object);
            console.log("Body added!");
        }
        contact.moveBodyOut();
    }

    notifyEndIntersection(object) {
        if (this.currSystem.bodys.has(object)) {
            object.currSystem = new MultiBodySystem(object, new Vector(0, 30));
            this.currSystem.removeBody(object);
            console.log("Body removed!");
        }
    }


}

module.exports = MovableBody;