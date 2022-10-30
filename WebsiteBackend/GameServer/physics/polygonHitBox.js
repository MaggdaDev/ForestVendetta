const Segment = require("./segment");
const Vector = require("../../GameStatic/js/maths/vector");

class PolygonHitBox {
    /**
     * 
     * @param {Object[]} points - points
     *  
     */
    constructor(points) {
        this.points = points;
        this.type = "POLYGON";
        this.ar = Math.abs(Vector.calcAr(this.points));

        this.initialPoints = [points.length];
        var i = points.length;
        while (i--) { this.initialPoints[i] = new Vector(points[i].x, points[i].y) };

        this.offSet = new Vector(0,0);
    }

    setOriginToZero() {
        this.offSet = this.pos;
    }

    static fromRect(x, y, w, h) {
        return new PolygonHitBox([new Vector(x - w/2, y - h/2),
        new Vector(x + w/2, y - h/2),
        new Vector(x + w/2, y + h/2), 
        new Vector(x - w/2, y + h/2)]);
    }

    /**
     * 
     * @param {Vector} point 
     */
    isPointInside(point) {
        var segs = this.segments;
        for (var i = 0; i < segs.length; i++) {
            if (!Vector.areClockwise([segs[i].from, segs[i].to, point])) {
                return false;
            }
        }
        return true;
    }

    moveOutOfHitBox(wayOut) {
        this.pos = Vector.add(this.pos, wayOut);
    }

    getPosRelToGravCenter(pos) {
        return Vector.subtractFrom(pos, this.gravCenter);
    }

    updateRot(newRot) {
        var s = Math.sin(newRot);
        var c = Math.cos(newRot);
        var currPointToRotate;
        var center = this.pos;
        for (var i = 0; i < this.initialPoints.length; i++) {
            currPointToRotate = this.initialPoints[i];
            this.points[i].x = c * (currPointToRotate.x - center.x) - s * (currPointToRotate.y - center.y) + center.x;
            this.points[i].y = s * (currPointToRotate.x - center.x) + c * (currPointToRotate.y - center.y) + center.y;
        }
    }

    set pos(newPos) {   // ALWAYS set pos NEVER set pos.x
        var curr = Vector.subtractFrom(this.pos, this.offSet);
        var diff = Vector.subtractFrom(newPos, curr);
        this.points.forEach((element) => {
            element.x += diff.x;
            element.y += diff.y;
        });
        this.initialPoints.forEach((element) => {
            element.x += diff.x;
            element.y += diff.y;
        });
    }

    get pos() {
        return this.gravCenter;
    }

    get gravCenter() {
        var gravCenter = new Vector(0, 0);
        var addX, addY;
        for (var i = 0; i < this.initialPoints.length - 1; i++) {
            addX = (this.initialPoints[i].x + this.initialPoints[i + 1].x) * (this.initialPoints[i].x * this.initialPoints[i + 1].y - this.initialPoints[i + 1].x * this.initialPoints[i].y);
            addY = (this.initialPoints[i].y + this.initialPoints[i + 1].y) * (this.initialPoints[i].x * this.initialPoints[i + 1].y - this.initialPoints[i + 1].x * this.initialPoints[i].y);
            gravCenter.x += addX;
            gravCenter.y += addY;
        }
        addX = (this.initialPoints[this.initialPoints.length - 1].x + this.initialPoints[0].x) * (this.initialPoints[this.initialPoints.length - 1].x * this.initialPoints[0].y - this.initialPoints[0].x * this.initialPoints[this.initialPoints.length - 1].y);
        addY = (this.initialPoints[this.initialPoints.length - 1].y + this.initialPoints[0].y) * (this.initialPoints[this.initialPoints.length - 1].x * this.initialPoints[0].y - this.initialPoints[0].x * this.initialPoints[this.initialPoints.length - 1].y);
        gravCenter.x += addX;
        gravCenter.y += addY;
        gravCenter = Vector.multiply(gravCenter, 1 / (6.0 * this.ar));
        return gravCenter;
    }


    get segments() {
        var ret = [];
        for (var i = 0; i < this.points.length - 1; i++) {
            ret.push(new Segment(this.points[i], this.points[i + 1]));
        }
        ret.push(new Segment(this.points[this.points.length - 1], this.points[0]));
        return ret;
    }

    getMirrored() {
        var mirroredPoints = [];
        for(var i = this.points.length-1; i>= 0; i--) {
            var currPoint = this.points[i];
            mirroredPoints.push(new Vector(currPoint.x * (-1.0), currPoint.y))
        }
        return new PolygonHitBox(mirroredPoints);
    }

    /**
     * OVERRIDE
     */
     toJSON() {
        var instance = this;
        return {
            pos: instance.pos,
            points: instance.points
        }
    }

}

module.exports = PolygonHitBox;