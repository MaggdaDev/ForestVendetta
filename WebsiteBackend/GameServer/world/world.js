const Platform = require("./platform");
const PolygonObject = require("./polygonObject");
const WorldObjectGenerator = require("./worldObjectGenerator");

class World {
    /**
     * 
     * @param {string} json - stringified json
     */
    constructor(json) {
        this.currentId = 0;
        var jsonObject = JSON.parse(json);
        this.worldObjects = [];
        jsonObject.worldObjects.forEach((currObj)=>{
            this.worldObjects.push(WorldObjectGenerator.loadWorldObject(currObj, this.nextId));
        });
        var testPol = new PolygonObject({"points":[{"x":30,"y":80},{"x":300,"y":80},{"x":300,"y":150},{"x":30,"y":150}],"type":"POLYGON"} ,this.nextId, false);
    
        this.worldObjects.push(testPol);
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


    /**
     * @returns {Object[]} update data
     */
    get clientWorldUpdateData() {
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