const HitBox = require("../physics/hitbox");
const WorldObject = require("./worldObject");

class Platform extends WorldObject{

    constructor(x,y,w,h) {
        super(new HitBox(x,y,w,h), true, 'platform');
    }
}

module.exports = Platform;