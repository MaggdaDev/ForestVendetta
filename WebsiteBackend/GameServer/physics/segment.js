const Vector = require("./vector");

class Segment {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.conn = new Vector(to.x - from.x, to.y - from.y);
    }
    
    intersect(other) {
        var detA = this.conn.y * other.conn.x - this.conn.x * other.conn.y;
        if(detA === 0) {
            //console.log("det is 0!");
            return null;
        }
        var det1 = (other.from.y - this.from.y) * other.conn.x - (other.from.x - this.from.x) * other.conn.y;
        var det2 = (other.from.y - this.from.y) * this.conn.x - (other.from.x - this.from.x) * this.conn.y;
        var lam = det1 / detA;
        var mic = det2 / detA;
        if(0.0 <= lam && lam <= 1.0 && 0.0 <= mic && mic <= 1.0) {
            return Vector.add(this.from, Vector.multiply(this.conn, lam));
        }
        return null;
    }

    
}

module.exports = Segment;