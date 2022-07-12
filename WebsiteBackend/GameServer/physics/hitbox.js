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
}

module.exports = HitBox;