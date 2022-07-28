const MovableBody = require("../physics/movableBody");

class WorldObject {

    /**
     * 
     * @param {HitBox} hitBox 
     * @param {boolean} isSolid 
     */
    constructor(hitBox, isSolid, type, mass, id) {
        this.isSolid = isSolid;
        this.hitBox = hitBox;
        this.type = type;
        this.id = id;
        this.movableBody = new MovableBody(this.hitBox, true, mass);
        this.movableBody.addGravity();
        
    }

    update(timeElapsed, intersectables) {
        this.movableBody.update(timeElapsed, intersectables);
    }

    get clientUpdateData() {
        return { id: this.id, pos: this.hitBox.pos, rot: this.movableBody.rot};
    }
}

module.exports = WorldObject;