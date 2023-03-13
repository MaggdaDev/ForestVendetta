const HitBox = require("./hitbox");
const JumpData = require("./jumpData");
const PhysicalContact = require("./physicalContact");
const RubberPoint = require("./rubberPoint");
const { isSimilarDir } = require("../../GameStatic/js/maths/vector");
const Vector = require("../../GameStatic/js/maths/vector");

class MovableBody {





    static GRAVITY = 500;
    static FRICTION_STRENGTH = 100000;
    static ROT_FRICTION_FACT = 0.5;
    static MAX_TIMEDIST_FOR_FRICT = 0.2;
    static MAX_WAY_OUT = 5;

    /**
     * 
     * @param {HitBox} hitBox - the hitbox
     * @param {Vector} hitBox.pos - the position to change
     * @param {number} mass
     */
    constructor(hitBox, mass, owner, bodyId) {
        this.owner = owner;
        this.bodyId = bodyId;
        this.hitBox = hitBox;
        this.acc = new Vector(0, 0);
        this.resultingForce = new Vector(0, 0);
        this.resultingRotMoment = 0;
        this.mass = mass;
        this.spd = new Vector(0, 0);
        this.rot = 0;
        this.rotSpd = 0;
        this.rotAcc = 0;

        this.isGravity = false;
        this.gravity = new Vector(0, MovableBody.GRAVITY);

        this.rubberPoints = [];

        this.isRotRubber = false;
        this.rotRubberStrength = 0;

        //this.inertiaMoment = this.mass * this.hitBox.ar;
        this.inertiaMoment = this.calcInertiaMoment();

        this.isAccImpulse = false;
        this.accImpulseData = null;

        this.rotationDisabled = false;
        this.singleContactsMap = new Map();

        this.isCompressable = false;

        this.wantToJump = false;
        this.wantToJumpOnce = false;
        this.jumpData = new JumpData("DEFAULT", 0, 0);

        this.onNewContact = [];

        this.shouldUndoLastUpdate = false;
        this.wayOutPriority = 1;

        this.isProtagonist = false;

        // handlers
        this.onNewIntersectionWithPlayerHandlers = [];

    }


    /**
     * 
     * @param {number} timeElapsed - in seconds 
     * @param {Set[Object]} intersectables 
     * @param {MovableBody} intersectables[0].movableBody
     */
    update(timeElapsed, intersectables) {
        var oldIsContact = this.isContact;

        this.refreshResultingForce(timeElapsed);

        this.acc = Vector.multiply(this.resultingForce, 1 / this.mass);
        this.spd.incrementBy(Vector.multiply(this.acc, timeElapsed));
        this.hitBox.pos = this.hitBox.pos.incrementBy(Vector.multiply(this.spd, timeElapsed));

        this.rotAcc = this.resultingRotMoment / this.inertiaMoment - Math.sign(this.rotSpd) * this.rotSpd * this.rotSpd * MovableBody.ROT_FRICTION_FACT;
        this.rotSpd += this.rotAcc * timeElapsed;
        this.rot += this.rotSpd * timeElapsed;

        //undo update
        this.checkIntersections(intersectables);
        if (this.shouldUndoLastUpdate) {
            this.shouldUndoLastUpdate = false;
            this.hitBox.pos = this.hitBox.pos.incrementBy(Vector.multiply(this.spd, -timeElapsed));
            this.spd.incrementBy(Vector.multiply(this.acc, -timeElapsed));
            this.rot -= this.rotSpd * timeElapsed;
            this.rotSpd -= this.rotAcc * timeElapsed;

            this.update(timeElapsed / 2, intersectables);
            this.update(timeElapsed / 2, intersectables);
        }

        this.hitBox.updateRot(this.rot);

        if ((!oldIsContact) && this.isContact) {
            this.notifyNewContact();
        }
    }

    reset() {
        this.spd.x = 0;
        this.spd.y = 0;
        this.rotSpd = 0;
    }

    /**
     * 
     * @param {function(player)} handler 
     */
    addOnNewIntersectionWithPlayer(handler) {
        this.onNewIntersectionWithPlayerHandlers.push(handler);
    }

    setProtagonist() {
        this.isProtagonist = true;
    }

    adjustJumpData(data) {
        Object.assign(this.jumpData, data);
    }

    notifyNewContact() {
        this.onNewContact.forEach((element) => {
            element();
        });
    }

    addOnNewContact(handler) {
        this.onNewContact.push(handler);
    }

    calcInertiaMoment() {   // https://en.wikipedia.org/wiki/List_of_moments_of_inertia
        var movedPoints = []
        var gravCenter = this.pos;
        this.hitBox.points.forEach((element) => {
            movedPoints.push(Vector.subtractFrom(element, gravCenter));
        });

        var pointAmount = movedPoints.length;
        var zaehlerSum = 0;
        var currAdd = 0;
        var pN, pN1;
        var dotSum = 0;
        for (var i = 0; i < pointAmount; i++) {
            pN = movedPoints[i];
            pN1 = movedPoints[(i + 1) % pointAmount]
            currAdd = Vector.zOfCross(pN1, pN);
            dotSum = pN.dot(pN);
            dotSum += pN.dot(pN1);
            dotSum += pN1.dot(pN1);
            currAdd *= dotSum;
            zaehlerSum += currAdd;
        }
        var nennerSum = 0;
        for (var i = 0; i < pointAmount; i++) {
            pN = movedPoints[i];
            pN1 = movedPoints[(i + 1) % pointAmount]
            nennerSum += Vector.zOfCross(pN1, pN);
        }
        nennerSum *= 6;

        return 100 * this.mass * zaehlerSum / nennerSum;
    }

    get controlData() {
        var ret = {};
        ret.kineticEnergy = 0.5 * this.mass * this.spd.abs * this.spd.abs;
        ret.rotationEnergy = 0.5 * this.inertiaMoment * this.rotSpd * this.rotSpd;
        if (this.isGravity) {
            ret.heightEnergy = this.mass * (1000 - this.hitBox.pos.y) * this.gravity.y;
        } else {
            ret.heightEnergy = 0;
        }
        ret.momentum = Vector.multiply(this.spd, this.mass);
        ret.rotMomentum = this.inertiaMoment * this.rotSpd;

        return ret;
    }

    setCompressable() {
        this.isCompressable = true;
    }


    disableRotation() {
        this.rotationDisabled = true;
    }

    addGravity() {
        this.isGravity = true;
    }

    addRubberPoint(rubberPos, zeta, f) {
        this.rubberPoints.push(new RubberPoint(rubberPos, this.hitBox.pos, zeta, f));
    }

    addRotRubber(strength) {
        this.isRotRubber = true;
        this.rotRubberStrength = strength;
    }

    refreshResultingForce(timeElapsed) {
        this.resultingForce.clear();
        this.resultingRotMoment = 0;

        if (this.isGravity) {
            this.resultingForce.incrementBy(Vector.multiply(this.gravity, this.mass));
        }

        this.rubberPoints.forEach((currRubberPoint) => {
            var force = currRubberPoint.getForce(this.hitBox.pos, this.rot, this.mass, this.spd, timeElapsed);
            this.resultingForce.incrementBy(force);
            this.resultingRotMoment += this.calcRotMoment(currRubberPoint.getAttackPoint(this.hitBox.pos, this.rot), force);

        });

        if (this.isRotRubber) {
            this.resultingRotMoment += (-1.0 * this.rotRubberStrength * this.rot - 0.2 * this.rotSpd * this.rotRubberStrength) * this.inertiaMoment;
        }
    }

    get pos() {
        return this.hitBox.pos;
    }

    /**
     * 
     * @param {Vector} point - coordinate on screen (NOT RELATIVE TO GRAV CENTER!)
     * @param {Vector} force 
     * @returns 
     */
    calcRotMoment(point, force) {
        return Vector.zOfCross(this.hitBox.getPosRelToGravCenter(point), force);
    }

    workForceOverTime(force, time) {
        this.spd.incrementBy(Vector.multiply(force, time / this.mass));
    }

    workRotMomentOverTime(moment, time) {
        if (!this.rotationDisabled) {
            this.rotSpd += time * moment / this.inertiaMoment;
        }
    }

    applyForceAndRot(force, point, time) {
        this.workForceOverTime(force, time);
        this.workRotMomentOverTime(this.calcRotMoment(point, force), time);
    }

    /**
     * 
     * @param {Vector} direction 
     * @param {number} desiredSpeed 
     * @param {number} acceleration 
     */
    generateAccelerateImpulse(direction, desiredSpeed, acceleration) {
        this.isAccImpulse = true;
        this.accImpulseData = { direction: direction, desiredSpeed: desiredSpeed, acceleration: acceleration };
    }

    stopAccelerateImpulse() {
        this.isAccImpulse = false;
        this.accImpulseData = null;
    }

    checkIntersections(intersectables) {
        var currBody;
        intersectables.forEach(element => {
            currBody = element.movableBody;
            if (currBody !== this) {
                var newIntersections = HitBox.getIntersections(currBody.hitBox, this.hitBox);
                if (newIntersections !== null && newIntersections.length > 2) {
                    this.shouldUndoLastUpdate = true;
                }
                if (newIntersections != null) {
                    this.notifyNewIntersection(currBody, newIntersections);
                }
            }
        });
    }

    newIntersectionWithPlayer(object, intersectionPoint) {
        this.onNewIntersectionWithPlayerHandlers.forEach((element) => {
            element(object.owner, intersectionPoint);
        });
    }

    notifyNewIntersection(object, newIntersections) {
        var contact = new PhysicalContact(this, object, newIntersections[0], newIntersections[1]);

        var overLapTime = contact.overlapTime;
        var thisForce = Vector.multiply(Vector.getLessSimilarTo(this.hitBox.getPosRelToGravCenter(contact.intersectionCenter), contact.normalDir), contact.overlapForce);
        var otherForce = Vector.multiply(Vector.getLessSimilarTo(object.hitBox.getPosRelToGravCenter(contact.intersectionCenter), contact.normalDir), contact.overlapForce);
        this.applyForceAndRot(thisForce, contact.intersectionCenter, overLapTime);
        object.applyForceAndRot(otherForce, contact.intersectionCenter, overLapTime);
        contact.moveBodyOut();

        this.eachOnIntersection(object, contact);
        object.eachOnIntersection(this, contact);
    }

    eachOnIntersection(object, contact) {
        var now = this.now;
        // handle high frequency contact = long contact
        if (!this.singleContactsMap.has(object.bodyId)) {   // first intersection this game? => no friction yet
            this.addNewSingleContact(object, now);
            this.checkForNewPlayerIntersection(object, contact.intersectionCenter);
        } else if (now - this.singleContactsMap.get(object.bodyId).lastIntersectionTime > MovableBody.MAX_TIMEDIST_FOR_FRICT) {  // last intersection with this object long ago?
            this.updateLastIntersectionTime(object, now, false);
            this.checkForNewPlayerIntersection(object, contact.intersectionCenter);
        } else {        //else: high frequency contact with this object => apply friction
            var rel1to2ParrSpd = Vector.subtractFrom(contact.getParallelPart(this.spd), contact.getParallelPart(object.spd));


            // time since last hight frequency contact:
            var time = now - this.singleContactsMap.get(object.bodyId).lastIntersectionTime;

            // calc friction:
            var fricForce = Vector.multiply(Vector.multiply(rel1to2ParrSpd.dirVec, rel1to2ParrSpd.abs/300), -MovableBody.FRICTION_STRENGTH);

            // calc manual acc (walking):
            var accForce = this.currControlAccForce;

            // aply friction and accc
            this.applyForceAndRot(Vector.add(fricForce, accForce), contact.intersectionCenter, time); // apply acc and fric!
            //object.applyForceAndRot(Vector.multiply(Vector.add(fricForce, accForce), -1.0), contact.intersectionCenter, time);     // apply acc and fric reactio!

            this.updateLastIntersectionTime(object, this.now, true);

        }

        // JUMP
        if (this.wantToJumpOnce || this.wantToJump) {
            if(this.wantToJumpOnce) {
                this.wantToJumpOnce = false;
            }
            this.updateLastIntersectionTime(object, this.now, false);
            var jumpForce = Vector.multiply(contact.normalDir, this.jumpData.jumpForce);
            jumpForce.rotBy(this.jumpData.angleAdjust);
            this.applyForceAndRot(Vector.getLessSimilarTo(this.hitBox.getPosRelToGravCenter(contact.intersectionCenter), jumpForce), contact.intersectionCenter, 1);
            object.applyForceAndRot(Vector.getLessSimilarTo(object.hitBox.getPosRelToGravCenter(contact.intersectionCenter), jumpForce), contact.intersectionCenter, 1);
        }
    }

    get currControlAccForce() {
        if (!this.isAccImpulse) {
            return new Vector(0, 0);
        }
        var instance = this;
        function calcAccImpX() {
            var directedDesiredSpdX = instance.accImpulseData.direction.x * instance.accImpulseData.desiredSpeed;

            if (Math.sign(directedDesiredSpdX - instance.spd.x) != Math.sign(directedDesiredSpdX)) {
                return 0;
            }
            var spdDiff = Math.abs((directedDesiredSpdX - instance.spd.x) / directedDesiredSpdX);
            return spdDiff * instance.accImpulseData.acceleration * instance.accImpulseData.direction.x;
        }
        function calcAccImpY() {
            var directedDesiredSpdY = instance.accImpulseData.direction.y * instance.accImpulseData.desiredSpeed;
            if (Math.sign(directedDesiredSpdY - instance.spd.y) != Math.sign(directedDesiredSpdY)) {
                return 0;
            }
            var spdDiff = Math.abs((directedDesiredSpdY - instance.spd.y) / directedDesiredSpdY);
            return spdDiff * instance.accImpulseData.acceleration * instance.accImpulseData.direction.y;
        }
        return Vector.multiply(new Vector(calcAccImpX(), calcAccImpY()), this.mass);
    }

    get now() {
        return Date.now() / 1000.0;
    }

    get isContact() {
        var ret = false;
        this.singleContactsMap.forEach((data)=>{
            if(this.now - data.lastIntersectionTime > MovableBody.MAX_TIMEDIST_FOR_FRICT) {
                this.updateLastIntersectionTime(data.body, data.lastIntersectionTime, false);
            }
            if(data.isContact) {
                ret = true;
            }
        });
        return ret;
    }

    /**
     * 
     * @param {MovableBody} object - intersected body
     * @param {Vector} intersection - intersection center of physical contact 
     */
    checkForNewPlayerIntersection(object, intersectionPoint) {
        if (object.isProtagonist) {
            this.newIntersectionWithPlayer(object, intersectionPoint);
        } 
    }

    // for body contact management: 
    addNewSingleContact(object, now) {
        this.singleContactsMap.set(object.bodyId, { body: object, lastIntersectionTime: now , isContact: false});
        //object.singleContactsMap.set(this.bodyId, { body: this, lastIntersectionTime: now, isContact: false});

    }
    updateLastIntersectionTime(object, now, isContact) {
        this.singleContactsMap.get(object.bodyId).lastIntersectionTime = now;
        this.singleContactsMap.get(object.bodyId).isContact = isContact;
    }

}


module.exports = MovableBody;