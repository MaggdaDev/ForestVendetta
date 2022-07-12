class Vector {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }


    clone() {
        return new Vector(this.x, this.y);
    }

    /**
     * 
     * @param {Vector} vec - vector to be added to this 
     * @param {number} mult - multiplicator to crop other vec before multiplication (i.e. timeElapsed) 
     * returns this. Only this gets changed.
     */
    addMultipliedVector(vec, mult) {
        return this.addVector(vec.clone().multWith(mult));
    }

    /**
     * 
     * @param {Vector} vec - vector which should be added to this. Only this gets changed. Returns this.
     */
    addVector(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    /**
     * 
     * @param {number} mult - multiplies x and y of this with mult. This gets changed. Returns this
     */
    multWith(mult) {
        this.x *= mult;
        this.y *= mult;
        return this;
    }
}
module.exports = Vector;