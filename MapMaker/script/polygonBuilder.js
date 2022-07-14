class PolygonBuilder {

    static SNAP_TO_POINT_RADIUS = 10;
    constructor(canvas, world) {
        this.currClicks = [];
        this.drawContext = canvas.getContext("2d");
        this.canvas = canvas;
        console.log(canvas.getBoundingClientRect().left);
        this.snapToFirst = true;
        this.currentlyDrawing = false;
        this.world = world;
    }


    draw(event) {
        this.drawContext.beginPath();
        for (var i = 0; i < this.currClicks.length - 1; i++) {
            this.drawLineFromTo(this.currClicks[i], this.currClicks[i + 1]);
        }
        if (this.currClicks.length > 0) {
            var currPos = this.getMousePos(event);
            if (this.isPosValid(currPos)) {
                this.drawLineFromTo(this.currClicks[this.currClicks.length - 1], currPos);
            }
        }

    }

    drawLineFromTo(from, to) {
        Drawer.drawLineFromTo(from, to, this.canvas);
    }

    onMouseMove(event) {
        if (this.currentlyDrawing) {
            this.draw(event);
        }
    }

    getMousePos(evt) {
        var rect = this.canvas.getBoundingClientRect();
        var pos = {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
        if (this.snapToFirst && this.currClicks.length > 1) {
            if (PolygonBuilder.getPosDist(pos, this.currClicks[0]) < PolygonBuilder.SNAP_TO_POINT_RADIUS) {
                pos.x = this.currClicks[0].x;
                pos.y = this.currClicks[0].y;
            }
        }
        return pos;
    }

    static getPosDist(pos1, pos2) {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2.0) + Math.pow(pos1.y - pos2.y, 2.0));
    }

    tryAddClick(event) {
        if (this.currClicks.length === 0 && (!this.currentlyDrawing)) {
            this.currentlyDrawing = true;
        }
        var click = this.getMousePos(event);
        console.log("Trying to add click...");
        if (this.isPosValid(click)) {
            if (this.isSameAsFirstPoint(click)) {
                this.drawLineFromTo(this.currClicks[this.currClicks.length - 1], click);
                this.currentlyDrawing = false;
                this.world.addWorldObject(new Polygon(this.currClicks));
                this.currClicks = [];
                console.log("Polygon finished!");
            } else {
                this.currClicks.push(click);
                console.log("Pos valid, added.")
            }
        }
    }

    isSameAsFirstPoint(click) {
        if (this.currClicks.length == 0) {
            return false;
        }
        if (this.currClicks[0].x == click.x && this.currClicks[0].y == click.y) {
            return true;
        }
    }

    isPosValid(click) {
        if (this.currClicks.length < 2) {
            return true;
        }
        if (this.isSameAsFirstPoint(click)) {
            return true;
        }
        if (this.hasEqualClick(click)) {
            return false;
        }

        return this.ccwOk(click);
    }

    hasEqualClick(click) {
        var has = false;
        this.currClicks.forEach((curr) => {
            if (curr.x == click.x && curr.y == click.y) {
                has = true;
            }
        });
        return has;
    }

    ccwOk(click) {
        var lastThree = [this.currClicks[this.currClicks.length - 2], this.currClicks[this.currClicks.length - 1], click];
        var withFirst = [click, this.currClicks[0], this.currClicks[1]];
        var lastAndFirst = [this.currClicks[this.currClicks.length - 1], click, this.currClicks[0]];
        return this.calcAr(lastThree) < 0 && this.calcAr(withFirst) < 0 && this.calcAr(lastAndFirst) < 0;

    }

    calcAr(clicks) {
        if (clicks.length < 2) {
            return 0;
        }
        var ar = 0;
        for (var i = 0; i < clicks.length - 1; i++) {
            ar += (clicks[i + 1].x - clicks[i].x) * (clicks[i + 1].y + clicks[i].y);
        }
        ar += (clicks[0].x - clicks[clicks.length - 1].x) * (clicks[0].y + clicks[clicks.length - 1].y);
        return ar;
    }



}