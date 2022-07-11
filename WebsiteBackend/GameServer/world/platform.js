const HitBox = require("../physics/hitbox");

class Platform {

    constructor(x,y,w,h) {
        this.hitBox = new HitBox(x,y,w,h);
        this.data = {
            x: x,
            y: y,
            w: w,
            h: h
        }
    }
}

module.exports = Platform;