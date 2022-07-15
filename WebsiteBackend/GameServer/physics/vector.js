class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * OVERRIDE
     */
    toJSON() {
        var instance = this;
        return {
            x: Math.round(instance.x * 10) / 10,
            y: Math.round(instance.y * 10) / 10
        }
    }

    incrementBy(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    get abs() {
        return Math.sqrt(Math.pow(this.x, 2.0) + Math.pow(this.y, 2.0));
    }

    get dirVec() {
        return Vector.multiply(this, 1.0 / this.abs);
    }

    get normalDir() {
        return this.normal.dirVec;
    }

    get normal() {
        return new Vector(this.y, -1 * this.x);
    }

    /**
     * 
     * @param {Vector} other
     * @returns {number} 
     */
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    clear() {
        this.x = 0.0;
        this.y = 0.0;
    }

    static add(vec1, vec2) {
        return new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
    }

    static multiply(vec, mult) {
        return new Vector(vec.x * mult, vec.y * mult);
    }

    static getMoreOtherDirTo(to, vec) {
        if(to.dot(vec) < 0) {
            return vec;
        } else {
            return Vector.multiply(vec,-1);
        }
    }

    static addWeighted(vec1, weight1, vec2, weight2) {
        var totWeight = weight1 + weight2;
        return Vector.add(Vector.multiply(vec1, weight1 / totWeight), Vector.multiply(vec2, weight2 / totWeight));
    }

    static center(vec1, vec2) {
        return new Vector((vec1.x + vec2.x) / 2, (vec1.y + vec2.y) /2);
    }

    /**
     * 
     * @param {Vector[]} vecs 
     */
    static areClockwise(vecs) {
        return Vector.calcAr(vecs) < 0;
    }

    static calcAr(vecs) {
        if (vecs.length < 2) {
            return 0;
        }
        var ar = 0;
        for (var i = 0; i < vecs.length - 1; i++) {
            ar += (vecs[i + 1].x - vecs[i].x) * (vecs[i + 1].y + vecs[i].y);
        }
        ar += (vecs[0].x - vecs[vecs.length - 1].x) * (vecs[0].y + vecs[vecs.length - 1].y);
        return ar/2.0;
    }

    static subtractFrom(from, sub) {
        var ret = from.clone();
        ret.x -= sub.x;
        ret.y -= sub.y;
        return ret;
    }

    /**
     * 
     * @param {Vector[]} vectors 
     */
    static getCenter(vectors) {
        var ret = new Vector(0, 0);
        vectors.forEach(element => {
            ret.incrementBy(element);
        });
        return Vector.multiply(ret, 1.0 / vectors.length);
    }



}
module.exports = Vector;