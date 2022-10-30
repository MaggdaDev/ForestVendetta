const PolygonHitBox = require("../physics/polygonHitBox");
const Vector = require("../../GameStatic/js/maths/vector");
const WorldObject = require("./worldObject");

class PolygonObject extends WorldObject {
    constructor(jsonObj, id) {
        super(new PolygonHitBox(jsonObj.points), jsonObj.isSolid, jsonObj.type, jsonObj.mass, id);
        var rubberPoints = jsonObj.rubberPoints;
        rubberPoints.forEach(element => {
            this.movableBody.addRubberPoint(Vector.from(element.pos), element.zeta, element.f);

        });
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