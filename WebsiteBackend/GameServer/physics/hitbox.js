const Intersection = require("./intersection");
const PolygonHitBox = require("./polygonHitBox");
const Vector = require("./vector");

class HitBox {
    constructor(x, y, w, h) {  //x,y: center cords; w,h: width/height
        this.width = w;
        this.height = h;
        this.pos = new Vector(x, y);
        this.type = 'rect';
    }

    get corners() {
        return [
            new Vector(this.pos.x - this.width / 2, this.pos.y - this.height / 2),
            new Vector(this.pos.x - this.width / 2, this.pos.y + this.height / 2),
            new Vector(this.pos.x + this.width / 2, this.pos.y + this.height / 2),
            new Vector(this.pos.x + this.width / 2, this.pos.y - this.height / 2)
        ];
    }

    /**
     * @param {HitBox} otherBox
     */
    intersects(otherBox) {
        if (otherBox.type == 'rect') {
            return this.corners[0].x < otherBox.corners[3].x && // this left < other right
                this.corners[3].x > otherBox.corners[0].x &&        // this right > other left
                this.corners[1].y > otherBox.corners[0].y &&        // this bot > other top
                this.corners[0].y < otherBox.corners[1].y;          // this top < other bot
        }
    }

    static getIntersections(h1, h2) {
        switch (h1.type) {
            case "POLYGON":
                switch (h2.type) {
                    case "POLYGON":
                        return HitBox.polygonPolygonIntersections(h1, h2);
                    default:
                        //console.log("Intersecting polygon with unknown hitbox type: " + JSON.stringify(h2));
                        break;
                }
                break;
            default:
                //console.log("Unknown hitbox type: " + JSON.stringify(h1));
                break;
        }
    }

    /**
     * 
     * @param {PolygonHitBox} p1 
     * @param {PolygonHitBox} p2 
     */
    static polygonPolygonIntersections(p1, p2) {
        var segments1 = p1.segments;
        var segments2 = p2.segments;
        var intersections = [];
        var currInt;
        for (var i = 0; i < segments1.length; i++) {
            for (var j = 0; j < segments2.length; j++) {
                currInt = segments1[i].intersect(segments2[j]);
                if (currInt !== null && currInt !== undefined) {
                    intersections.push(new Intersection(segments1[i], segments2[j], currInt));
                    
                }
            }
        }
        if(intersections.length > 2) {
            console.log("MORE THAN 2 INTERSECTIONS!");
            return intersections;
        }
        if(intersections.length === 2) {
            return intersections;
        }
        return null;
    }

}

module.exports = HitBox;