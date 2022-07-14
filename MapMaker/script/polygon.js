class Polygon {

    /**
     * 
     * @param {Object[]} points 
     */
    constructor(points) {
        this.points = points;
        this.type = "POLYGON";
        this.isSolid = true;
    }

    draw(canvas) {
        for(var i = 0; i < this.points.length-1; i++) {
            Drawer.drawLineFromTo(this.points[i], this.points[i+1], canvas);
        }
        Drawer.drawLineFromTo(this.points[this.points.length-1], this.points[0], canvas);
    }
}