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
        this.currPolygonToAdd = null;
        this.drawState = "none";
    }


    draw(event) {
        if (this.currentlyDrawing) {
            for (var i = 0; i < this.currClicks.length - 1; i++) {
                this.drawLineFromTo(this.currClicks[i], this.currClicks[i + 1]);
            }
            if (this.currClicks.length > 0) {
                var currPos = this.getMousePos(event);
                if (this.isPosValid(currPos)) {
                    this.drawLineFromTo(this.currClicks[this.currClicks.length - 1], currPos);
                }
            }
        } else if (this.drawState = "addRubberPoint") {
            this.currPolygonToAdd.drawWithTempRubber(canvas, this.getMousePos(event));
        }

    }

    addPolygonClicked() {

        if (this.currPolygonToAdd !== null) {
            var mass = document.getElementById("massInput").value;
            this.currPolygonToAdd.mass = mass;
            console.log("Adding polygon now!");
            this.world.addWorldObject(this.currPolygonToAdd);
            this.currPolygonToAdd = null;
            this.currentlyDrawing = false;
            this.drawState = "none";
            this.currClicks = [];
        } else {
            console.log("Error! Polygon is null!");
        }
    }

    cancelAddPolygon() {
        this.currPolygonToAdd = null;
        console.log("Cancelled adding current polygon.");
        this.currentlyDrawing = false;
        this.drawState = "none";
        this.currClicks = [];
    }

    addRubberPointConfirmed() {
        var f = document.getElementById("fInput").value;
        var zeta = document.getElementById("zetaInput").value;
        var pos = JSON.parse(document.getElementById("rubberPointPositionLabel").textContent);
        this.currPolygonToAdd.addRubberPoint(pos, zeta, f);
        this.drawState = "drawingFinished";
        this.refreshRubberPointInfo();
        this.showAddPolygonDialog();
    }

    cancelAddRubberPoint() {
        this.drawState = "drawingFinished";
        this.refreshRubberPointInfo();
        this.showAddPolygonDialog();
    }

    searchRubberPoint() {
        this.drawState = 'addRubberPoint';
    }

    drawLineFromTo(from, to) {
        Drawer.drawLineFromTo(from, to, this.canvas);
    }

    onMouseMove(event) {
        if (this.currentlyDrawing) {
            this.draw(event);
        } else if (this.drawState === 'drawingFinished' || this.drawState === 'addRubberPoint') {
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
        if (this.drawState === 'drawing' || this.drawState === 'none') {
            if (this.currClicks.length === 0 && (!this.currentlyDrawing)) {
                this.currentlyDrawing = true;
                this.drawState = "drawing";
            }
            var click = this.getMousePos(event);
            console.log("Trying to add click...");
            if (this.isPosValid(click)) {
                if (this.isSameAsFirstPoint(click)) {
                    this.drawLineFromTo(this.currClicks[this.currClicks.length - 1], click);
                    this.currentlyDrawing = false;
                    this.drawState = "drawingFinished";
                    this.currPolygonToAdd = new Polygon(this.currClicks);
                    this.currClicks = [];
                    this.showAddPolygonDialog();
                    console.log("Dialog opened");
                } else {
                    this.currClicks.push(click);
                    console.log("Pos valid, added.")
                }
            }
        } else if (this.drawState === 'addRubberPoint') {
            console.log("Adding rubber point!");
            document.getElementById("rubberPointPositionLabel").textContent = JSON.stringify(this.getMousePos(event));
            this.showAddRubberPointDialog();
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

    refreshRubberPointInfo() {
        var newText = "Current rubber points:";
        this.currPolygonToAdd.rubberPoints.forEach((element) => {
            newText += "<br />  -  " + JSON.stringify(element);
        });
        document.getElementById("currRubberPointsLbl").innerHTML = newText;
    }

    showAddPolygonDialog() {
        document.getElementById("addPolygonDialog").showModal();
    }

    showAddRubberPointDialog() {
        document.getElementById("addRubberPointDialog").showModal();
    }




}