const PolygonHitBox = require("../physics/polygonHitBox");
const WorldObject = require("./worldObject");

class PolygonObject extends WorldObject {
    constructor(jsonObj, id, isRubber) {
        if (isRubber === undefined) {
            super(new PolygonHitBox(jsonObj.points), jsonObj.isSolid, jsonObj.type, id, true);
        } else {
            super(new PolygonHitBox(jsonObj.points), jsonObj.isSolid, jsonObj.type, id, isRubber);
        }
    }


    /**
         * OVERRIDE
         */
    toJSON() {
        var instance = this;
        return {
            id: instance.id,
            type: instance.type,
            points: instance.hitBox.initialPoints,
            isSolid: instance.isSolid,
            pos: instance.hitBox.pos
        }
    }
}

module.exports = PolygonObject;