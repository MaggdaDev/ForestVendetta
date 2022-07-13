const Vector = require("./vector");

class MultiBodySystem {

    /**
     * 
     * @param {MovableBody} initBody
     * @param {Vector} spd
     */
    constructor(initBody, spd) {
        this.sharedMass = initBody.mass;
        this.sharedSpd = spd;
        this.bodys = new Set();
        this.bodys.add(initBody);
        this.isUsed = true;
    }

    addBody(body) {
        this.isUsed = false;
        this.bodys.add(body);
        this.sharedSpd = Vector.addWeighted(this.sharedSpd, this.sharedMass, body.currSystem.sharedSpd, body.mass);
        this.sharedMass += body.mass;
        body.currSystem = this;
    }

    /**
     * 
     * @param {Vector} spdIncr 
     * @param {number} weight 
     */
    addWeightedSpd(spdIncr, weight) {
        this.sharedSpd.incrementBy(Vector.multiply(spdIncr, weight/this.sharedMass));
    }

    /**
     * 
     * @param {MovableBody} body
     * CHANGE BODY SPEED BEFORE! 
     */
    removeBody(body) { 
        this.bodys.delete(body);
        this.sharedMass -= body.mass;
        this.sharedSpd.incrementBy(Vector.multiply(body.currSystem.sharedSpd, -1 * body.mass / this.sharedMass));
        
    }
}

module.exports = MultiBodySystem;