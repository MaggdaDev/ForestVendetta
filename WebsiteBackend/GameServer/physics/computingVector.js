const Vector = require("./vector");

class ComputingVector extends Vector {

    constructor(startX, startY, computeX, computeY) {
        super(startX, startY);
        this.computeX = computeX;
        this.computeY = computeY;
    }
    get x() {
        this._x = this.computeX();
        return this._x;
    }
    get y() {
        this._y = this.computeY();
        return this._y;
    }
    set x(num) {
        this._x = num;
    }
    set y(num) {
        this._y = num;
    }

}

module.exports = ComputingVector;