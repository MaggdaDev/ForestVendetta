const Vector = require("./vector");

class HitBox {
    constructor(x, y, w, h) {  //x,y: center cords; w,h: width/height
        this.xPos = x;          //center x 
        this.yPos = y;          //center y
        this.width = w;
        this.height = h;
        this.pos = new Vector(x, y);
        this.corners = [
            new Vector(x - w / 2, y - h / h),
            new Vector(x - w / 2, y + h / 2),
            new Vector(x + w / 2, y + h / 2),
            new Vector(x + w / 2, y - h / 2)
        ];
        this.type = 'rect';
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