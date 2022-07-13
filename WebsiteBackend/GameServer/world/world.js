const Platform = require("./platform");

class World {
    constructor() {
        this.worldObjects = [];
        this.currentId = 0;
        
    }

    update(timeElapsed) {
        var intersectables = this.intersectables;
        this.worldObjects.forEach((currObj)=>{
            currObj.update(timeElapsed, intersectables);
        });
    }

    get intersectables() {
        var intersectables = [];
        this.worldObjects.forEach((currObj)=>{
            if(currObj.isSolid) {
                intersectables.push(currObj.movableBody);
            }
        });
        return intersectables;
    }

    buildWorld() {
        console.log("Building world...")

        this.addNewPlatform(500, 500, 500, 50, true);
        this.addNewPlatform(500, 300, 980, 40, false);

        this.clientWorldUpdateData = this.createClientWorldUpdateData();
        console.log("World built.")
    }

    /**
     * @returns {Object[]} update data
     */
    createClientWorldUpdateData() {
        var ret = [];
        this.worldObjects.forEach((currObj)=>{
            ret.push(currObj.clientUpdateData);
        });
        return ret;
    }

    addNewPlatform(x,y,w,h,rubber) {
        this.addWorldObject(new Platform(x,y,w,h, this.nextId,rubber));
    }

    get nextId() {
        var ret = this.currentId;
        this.currentId += 1;
        return ret;
    }

    /**
     * 
     * @param {WorldObject} worldObject 
     */
    addWorldObject(worldObject) {
        this.worldObjects.push(worldObject);
    }
}

module.exports = World;