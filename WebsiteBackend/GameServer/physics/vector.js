class Vector {
    constructor (x, y) {
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
    }

    get abs() {
        return Math.sqrt(Math.pow(this.x, 2.0) + Math.pow(this.y, 2.0));
    }

    get dirVec() {
        return Vector.multiply(this, 1.0/this.abs);
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    static add(vec1, vec2) {
        return new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
    }

    static multiply(vec, mult) {
        return new Vector(vec.x * mult, vec.y * mult);
    }

    static addWeighted(vec1, weight1, vec2, weight2) {
        var totWeight = weight1 + weight2;
        return Vector.add(Vector.multiply(vec1, weight1/totWeight), Vector.multiply(vec2, weight2/totWeight));
    }



}
module.exports = Vector;