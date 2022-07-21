class Polygon {

    /**
     * 
     * @param {Object[]} points 
     */
    constructor(points) {
        this.points = points;
        this.type = "POLYGON";
        this.isSolid = true;
        this.rubberPoints = [];
    }

    draw(canvas) {
        for (var i = 0; i < this.points.length - 1; i++) {
            Drawer.drawLineFromTo(this.points[i], this.points[i + 1], canvas);
        }
        Drawer.drawLineFromTo(this.points[this.points.length - 1], this.points[0], canvas);

        // draw rubber points
        this.rubberPoints.forEach((element) => {
            Drawer.drawRubberPoint(element.pos, canvas);
            Drawer.drawRubberLine(this.gravCenter, element.pos, canvas)
        });
    }

    drawWithTempRubber(canvas, tempRubberPos) {
        this.draw(canvas);
        Drawer.drawRubberPoint(tempRubberPos, canvas);
        Drawer.drawRubberLine(this.gravCenter, tempRubberPos, canvas);
    }

    addRubberPoint(pos, zeta, f) {
        var add = {
            pos: pos,
            zeta: zeta,
            f: f
        }
        this.rubberPoints.push(add);
    }

    get gravCenter() {
        var gravCenter = { x: 0, y: 0 };
        var addX, addY;
        for (var i = 0; i < this.points.length - 1; i++) {
            addX = (this.points[i].x + this.points[i + 1].x) * (this.points[i].x * this.points[i + 1].y - this.points[i + 1].x * this.points[i].y);
            addY = (this.points[i].y + this.points[i + 1].y) * (this.points[i].x * this.points[i + 1].y - this.points[i + 1].x * this.points[i].y);
            gravCenter.x += addX;
            gravCenter.y += addY;
        }
        addX = (this.points[this.points.length - 1].x + this.points[0].x) * (this.points[this.points.length - 1].x * this.points[0].y - this.points[0].x * this.points[this.points.length - 1].y);
        addY = (this.points[this.points.length - 1].y + this.points[0].y) * (this.points[this.points.length - 1].x * this.points[0].y - this.points[0].x * this.points[this.points.length - 1].y);
        gravCenter.x += addX;
        gravCenter.y += addY;
        gravCenter.x /= (6.0 * Math.abs(this.ar));
        gravCenter.y /= (6.0 * Math.abs(this.ar));
        return gravCenter;
    }

    get ar() {
        var ar = 0;
        for (var i = 0; i < this.points.length - 1; i++) {
            ar += (this.points[i + 1].x - this.points[i].x) * (this.points[i + 1].y + this.points[i].y);
        }
        ar += (this.points[0].x - this.points[this.points.length - 1].x) * (this.points[0].y + this.points[this.points.length - 1].y);
        return ar / 2;
    }
}