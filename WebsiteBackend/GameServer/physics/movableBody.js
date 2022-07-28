const Protagonist = require("../player/protagonist");
const HitBox = require("./hitbox");
const PhysicalContact = require("./physicalContact");
const RubberPoint = require("./rubberPoint");
const { isSimilarDir } = require("./vector");
const Vector = require("./vector");

class MovableBody {

    /**
     * 
     * @param {HitBox} hitBox - the hitbox
     * @param {Vector} hitBox.pos - the position to change
     * @param {number} mass
     */
    static GRAVITY = 270;
    static FRICTION_STRENGTH = 10000;
    static ROT_FRICTION_FACT = 0.1;
    static MAX_TIMEDIST_FOR_FRICT = 0.2;
    static JUMP_FORCE = 20000;
    constructor(hitBox, isElastic, mass) {
        this.hitBox = hitBox;
        this.acc = new Vector(0, 0);
        this.resultingForce = new Vector(0, 0);
        this.resultingRotMoment = 0;
        this.isElastic = isElastic;
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

        this.isFrictive = false;
        this.lastFrictiveIntersectionTime = 0;
        this.newFrictiveIntersectionTime = 0;
        this.isContact = false;

        this.isCompressable = false;

        this.wantToJump = false;

        this.onNewContact = [];

        this.playerBodyContacts = new Set();
    }

    /**
     * 
     * @param {number} timeElapsed - in seconds 
     * @param {Set[MovableBody]} intersectables 
     */
    update(timeElapsed, intersectables) {
        var oldIsContact = this.isContact;

        this.refreshResultingForce(timeElapsed);

        this.acc = Vector.multiply(this.resultingForce, 1 / this.mass);
        this.spd.incrementBy(Vector.multiply(this.acc, timeElapsed));
        this.hitBox.pos = this.hitBox.pos.incrementBy(Vector.multiply(this.spd, timeElapsed));

        this.rotAcc = this.resultingRotMoment / this.inertiaMoment - Math.sign(this.rotSpd) * this.rotSpd * this.rotSpd * MovableBody.ROT_FRICTION_FACT;
        this.rotSpd +=  this.rotAcc * timeElapsed;
        this.rot += this.rotSpd * timeElapsed;

        //undo update
        if(this.checkIntersections(intersectables)) {
            this.spd.incrementBy(Vector.multiply(this.acc, -timeElapsed));
            this.hitBox.pos = this.hitBox.pos.incrementBy(Vector.multiply(this.spd, -timeElapsed));
            this.rotSpd -=  this.rotAcc * timeElapsed;
            this.rot -= this.rotSpd * timeElapsed;
            this.update(timeElapsed/2, intersectables);
            this.update(timeElapsed/2, intersectables);
        }
        
        this.refreshContact();
        this.hitBox.updateRot(this.rot);

        if((!oldIsContact) && this.isContact) {
            this.notifyNewContact();
        }
    }

    notifyNewContact() {
        this.onNewContact.forEach((element)=>{
            element();
        });
    }
    
    addOnNewContact(handler) {
        this.onNewContact.push(handler);
    }

    calcInertiaMoment() {   // https://en.wikipedia.org/wiki/List_of_moments_of_inertia
        var movedPoints = []
        var gravCenter = this.pos;
        this.hitBox.points.forEach((element)=>{
            movedPoints.push(Vector.subtractFrom(element, gravCenter));
        });

        var pointAmount = movedPoints.length;
        var zaehlerSum = 0;
        var currAdd = 0;
        var pN, pN1;
        var dotSum = 0;
        for(var i = 0; i < pointAmount; i++) {
            pN = movedPoints[i];
            pN1 = movedPoints[(i+1)%pointAmount]
            currAdd = Vector.zOfCross(pN1, pN);
            dotSum = pN.dot(pN);
            dotSum += pN.dot(pN1);
            dotSum += pN1.dot(pN1);
            currAdd *= dotSum;
            zaehlerSum += currAdd;
        }
        var nennerSum = 0;
        for(var i = 0; i < pointAmount; i++) {
            pN = movedPoints[i];
            pN1 = movedPoints[(i+1)%pointAmount]
            nennerSum += Vector.zOfCross(pN1, pN);
        }
        nennerSum *= 6;

        return this.mass * zaehlerSum / nennerSum;
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

    setFrictive() {
        this.isFrictive = true;
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

        this.rubberPoints.forEach((currRubberPoint)=>{
            var force = currRubberPoint.getForce(this.hitBox.pos, this.rot, this.mass, this.spd, timeElapsed);
            this.resultingForce.incrementBy(force);
            this.resultingRotMoment += this.calcRotMoment(currRubberPoint.getAttackPoint(this.hitBox.pos, this.rot), force);

        });

        /*
        if (this.isRubberPoint) {
            var abstand = Vector.subtractFrom(this.rubberPointDestination, this.hitBox.pos).abs;
            //this.rubberData.zeta = 1/Math.max(0.5,abstand);
            //this.rubberData.f = 17/Math.max(10,abstand);
            var res = Vector.subtractFrom(Vector.subtractFrom(this.rubberPointDestination, this.hitBox.pos), Vector.multiply(this.spd, this.rubberData.zeta / (this.rubberData.f * Math.PI)));
            res = Vector.multiply(res, 2.0 * this.mass * Math.pow(Math.PI * this.rubberData.f, 2.0));

            var leftCtrl = Math.pow(Math.PI * this.rubberData.f, 2.0);
            var rightCtrl = timeElapsed * this.rubberData.zeta / (2 * Math.PI * this.rubberData.f);
            if (rightCtrl > leftCtrl) {
                console.log("EIGENVALUES");
            }
            //res = Vector.multiply(Vector.subtractFrom(this.rubberPoint, this.hitBox.pos), 20000);
            this.resultingForce.incrementBy(res);
        }
        */

        if (this.isRotRubber) {
            this.resultingRotMoment += (-1.0 * this.rotRubberStrength * this.rot - 0.2 * this.rotSpd * this.rotRubberStrength) * this.inertiaMoment;
        }

        /*
        if (this.isAccImpulse) {
            this.resultingForce.incrementBy(this.currControlAccForce);   
        }
        */
    }

    get currControlAccForce() {
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

    get pos() {
        return this.hitBox.pos;
    }

    refreshContact() {
        if(this.isContact) {
            if(Date.now()/1000.0 - this.lastFrictiveIntersectionTime > MovableBody.MAX_TIMEDIST_FOR_FRICT) {
                this.isContact = false;
            }
        }
        var toRemove = [];
        this.playerBodyContacts.forEach((element)=>{
            if(!element.isContact) {
                toRemove.push(element);
            }
        });
        toRemove.forEach((element)=>{
            this.playerBodyContacts.delete(element);
        });
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
        this.workRotMomentOverTime(this.calcRotMoment(point, force),time);
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
        var shouldUndo = false;
        intersectables.forEach(element => {
            if (element !== this) {
                var newIntersections = HitBox.getIntersections(element.hitBox, this.hitBox);
                if(newIntersections !== null && newIntersections.length > 2) {
                    shouldUndo = true;
                }
                if (newIntersections != null) {
                    this.notifyNewIntersection(element, newIntersections);
                }
            }
        });
        return shouldUndo;
    }

    notifyNewIntersection(object, newIntersections) {
        var contact = new PhysicalContact(this, object, newIntersections[0], newIntersections[1]);
        if (this.isElastic && object.isElastic) {
            var oldSpdDiff = Vector.subtractFrom(object.spd, this.spd);
            //console.log("Both elastic!");
            var overLapTime = contact.overlapTime;
            var thisForce = Vector.multiply(Vector.getLessSimilarTo(this.hitBox.getPosRelToGravCenter(contact.intersectionCenter), contact.normalDir), contact.overlapForce);
            var otherForce = Vector.multiply(Vector.getLessSimilarTo(object.hitBox.getPosRelToGravCenter(contact.intersectionCenter), contact.normalDir), contact.overlapForce);
            /*
            this.workForceOverTime(thisForce, overLapTime);
            object.workForceOverTime(otherForce, overLapTime);
            var thisRotMoment = Vector.zOfCross(this.hitBox.getPosRelToGravCenter(contact.intersectionCenter), thisForce);
            var otherRotMoment = Vector.zOfCross(object.hitBox.getPosRelToGravCenter(contact.intersectionCenter), otherForce);
            this.workRotMomentOverTime(thisRotMoment, overLapTime);
            object.workRotMomentOverTime(otherRotMoment, overLapTime);
            */
           this.applyForceAndRot(thisForce, contact.intersectionCenter, overLapTime);
           object.applyForceAndRot(otherForce,contact.intersectionCenter, overLapTime);
            contact.moveBodyOut();

            // apply friction

            if (this.isFrictive || object.isFrictive) {
                var now = Date.now() / 1000.0;
                this.newFrictiveIntersectionTime = now;
                object.newFrictiveIntersectionTime = now;
                if ((((this.newFrictiveIntersectionTime - this.lastFrictiveIntersectionTime) < MovableBody.MAX_TIMEDIST_FOR_FRICT) && this.lastFrictiveIntersectionTime!==0) && (((object.newFrictiveIntersectionTime - object.lastFrictiveIntersectionTime) < MovableBody.MAX_TIMEDIST_FOR_FRICT) && object.lastFrictiveIntersectionTime!==0)) {

                    var rel1to2ParrSpd = Vector.subtractFrom(contact.getParallelPart(this.spd), contact.getParallelPart(object.spd));
                    if (rel1to2ParrSpd.abs != 0) {
                        var fricForce = Vector.multiply(rel1to2ParrSpd.dirVec, MovableBody.FRICTION_STRENGTH);
                        var time;
                        var accForce = new Vector(0,0);
                        if(this.isFrictive) {
                            time = this.newFrictiveIntersectionTime - this.lastFrictiveIntersectionTime;
                            this.isContact = true;
                            if(this.isAccImpulse) {
                                accForce = Vector.multiply(this.currControlAccForce, -1.0);
                            }
                        } else {
                            time = object.newFrictiveIntersectionTime - object.lastFrictiveIntersectionTime;
                            object.isContact = true;
                            this.playerBodyContacts.add(this);
                            if(object.isAccImpulse) {
                                accForce = object.currControlAccForce;
                            }
                        }
                        this.applyForceAndRot(Vector.multiply(Vector.add(fricForce, accForce), -1.0), contact.intersectionCenter,time); // apply acc and fric!
                        object.applyForceAndRot(Vector.add(fricForce, accForce), contact.intersectionCenter, time);     // apply acc and fric reactio!
                    }
                }
                this.lastFrictiveIntersectionTime = now;
                object.lastFrictiveIntersectionTime = now;

                if(this.wantToJump) {
                    this.wantToJump = false;
                    this.isContact = false;
                    var jumpForce = Vector.multiply(contact.normalDir, MovableBody.JUMP_FORCE);
                    /*
                    this.workForceOverTime(Vector.getLessSimilarTo(this.hitBox.getPosRelToGravCenter(contact.intersectionCenter), jumpForce), 1);
                    var otherForce = Vector.getLessSimilarTo(object.hitBox.getPosRelToGravCenter(contact.intersectionCenter), jumpForce);
                    object.workForceOverTime(otherForce, 1);
                    object.workRotMomentOverTime(this.calcRotMoment(contact.intersectionCenter, otherForce),1);
                    */
                   this.applyForceAndRot(Vector.getLessSimilarTo(this.hitBox.getPosRelToGravCenter(contact.intersectionCenter), jumpForce),contact.intersectionCenter,1);
                   object.applyForceAndRot(Vector.getLessSimilarTo(object.hitBox.getPosRelToGravCenter(contact.intersectionCenter), jumpForce),contact.intersectionCenter,1);
                }
            }

        }
    }
    /*
    applyReactioToMoment(timeElapsed) {
        var reactio = new Vector(0, 0);
        this.persistingContacts.forEach((currContact) => {
            var otherBody = currContact.getOtherBody(this);
            var reactio = Vector.multiply(currContact.getNormalPart(this.resultingForce), -1.0);
            if (!Vector.isSimilarDir(reactio, this.hitBox.getPosRelToGravCenter(currContact.intersectionCenter))) {
                console.log("Reactio at " + this.name);
                reactio.incrementBy(reactio);
                var rotMoment = this.calcRotMoment(currContact.intersectionCenter, reactio);
                this.workRotMomentOverTime(rotMoment, timeElapsed);
            }
        });
        return reactio;
    }

    updateActio(timeElapsed) {
        this.persistingContacts.forEach((currContact) => {
            var otherBody = currContact.getOtherBody(this);
            var otherBodyResForcePart = currContact.getNormalPart(otherBody.resultingForce);
            if (!Vector.isSimilarDir(otherBodyResForcePart, this.hitBox.getPosRelToGravCenter(currContact.intersectionCenter))) {
                this.resultingForce.incrementBy(otherBodyResForcePart);
                var rotMoment = this.calcRotMoment(currContact.intersectionCenter, otherBodyResForcePart);
                this.workRotMomentOverTime(rotMoment, timeElapsed);
            }
        });
    }
    */

    /*
    notifyEndIntersection(element) {
        this.intersections.delete(element);
        element.intersections.delete(this);
        this.persistingContacts.forEach((currCont) => {
            if (currCont.getOtherBody(this) === element) {
                currCont.killCauseNoInt = true;
            }
        });
        console.log("Notify end int");
    }
    */

    /*
    updatePersistingContacts() {
        this.persistingContacts.forEach((currContact) => {
            if (!currContact.shouldPersist()) {
                //currContact.moveBodyOut();
                this.persistingContacts.delete(currContact);
                currContact.getOtherBody(this).persistingContacts.delete(currContact);
                console.log("Persisting contact removed!");
                this.notifyEndIntersection(currContact.getOtherBody(this));
            } else {
                //currContact.moveAlmostOut();
                //console.log("Moved almost out");
            }
        });
    }
    */


}

module.exports = MovableBody;