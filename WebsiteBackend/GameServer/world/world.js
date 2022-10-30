const Vector = require("../../GameStatic/js/maths/vector");
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
            this.worldObjects.push(WorldObjectGenerator.loadWorldObject(currObj, this.nextWorldId));
        });
        
        
    }

    update(timeElapsed, worldIntersectables, mobIntersectables, playerIntersectables) {
        var controlData = [];
        this.worldObjects.forEach((currObj)=>{
            currObj.update(timeElapsed, worldIntersectables.concat(mobIntersectables).concat(playerIntersectables));
            controlData.push(currObj.movableBody.controlData);
        });
        return controlData;
    }

    get intersectables() {
        var intersectables = [];
        this.worldObjects.forEach((currObj)=>{
            if(currObj.isSolid) {
                intersectables.push(currObj);
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
        this.addWorldObject(new Platform(x,y,w,h, this.nextWorldId,rubber));
    }

    get nextWorldId() {
        var ret = this.currentId;
        this.currentId += 1;
        return "W" + String(ret);
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