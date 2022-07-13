const ComputingVector = require("./computingVector");
const MultiBodySystem = require("./multiBodySystem");
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
        this.currSystem = new MultiBodySystem(this, new Vector(0,0));
    }

    addGravity() {
        this.gravity = new Vector(0, 20);
        this.acc.addVector(this.gravity);
    }

    addRubberPoint(rubberPoint) {
        var instance = this;
        this.acc.addVector(new ComputingVector(0, 0, () => { return rubberPoint.x - instance.hitBox.pos.x }, () => { return rubberPoint.y - instance.hitBox.pos.y }));
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
        this.hitBox.pos.incrementBy(Vector.multiply(this.currSystem.sharedSpd, timeElapsed));

    }

    checkIntersections(intersectables) {
        intersectables.forEach(element => {
            if (element != this && element.hitBox.intersects(this.hitBox)) {
                if (!this.intersections.has(element)) {
                    this.intersections.add(element);
                    element.intersections.add(this);
                    this.notifyNewIntersection(element);
                }
            } else {
                if (this.intersections.has(element)) {
                    this.intersections.delete(element);
                    element.intersections.delete(this);
                    this.notifyEndIntersection(element);
                }
            }
        });
    }

    notifyNewIntersection(object) {
        if (this.isElastic && object.isElastic) {
            console.log("Both elastic!");
            var thisSpd = this.currSystem.sharedSpd.clone();
            var otherSpd = object.currSystem.sharedSpd.clone();
            this.currSystem.sharedSpd.x = otherSpd.x;
            this.currSystem.sharedSpd.y = otherSpd.y;
            object.currSystem.sharedSpd.x = thisSpd.x;
            object.currSystem.sharedSpd.y = thisSpd.y;
        } else {
            this.currSystem.addBody(object);
            console.log("Body added!");
        }
    }

    notifyEndIntersection(object) {
        if(this.currSystem.bodys.has(object)) {
            object.currSystem = new MultiBodySystem(object, new Vector(0,30));
            this.currSystem.removeBody(object);
            console.log("Body removed!");
        }
    }


}

module.exports = MovableBody;