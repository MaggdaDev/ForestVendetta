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
        
        /*
        jsonObject.worldObjects.forEach((currObj)=>{
            this.worldObjects.push(WorldObjectGenerator.loadWorldObject(currObj, this.nextId));
        });
        */
        
        var xAdd = -110;
        var yAdd = 400;
        var testPol = new PolygonObject({"points":[{"x":200+xAdd,"y":80+yAdd},{"x":700+xAdd,"y":80+yAdd},{"x":500+xAdd,"y":150+yAdd},{"x":400+xAdd,"y":150+yAdd}],"type":"POLYGON", isSolid:"true"} ,this.nextId, false);
        testPol.movableBody.rotSpd = 0;
        testPol.movableBody.mass = 300;
        testPol.movableBody.addRubberPoint(testPol.hitBox.pos);
        testPol.movableBody.addRotRubber(10);
        //testPol.movableBody.addRotRubber(100);
    
        this.worldObjects.push(testPol);
/*
        xAdd = -120;
        var yAdd = 400;
        testPol = new PolygonObject({"points":[{"x":200+xAdd,"y":80+yAdd},{"x":700+xAdd,"y":80+yAdd},{"x":500+xAdd,"y":150+yAdd},{"x":400+xAdd,"y":150+yAdd}],"type":"POLYGON", isSolid:"true"} ,this.nextId, false);
        testPol.movableBody.rotSpd = 0;
        testPol.movableBody.mass = 3000;
        testPol.movableBody.addRubberPoint(testPol.hitBox.pos);
        testPol.movableBody.addRotRubber(10);
        this.worldObjects.push(testPol);
        */
        
    }

    update(timeElapsed) {
        var intersectables = this.intersectables;
        var controlData = [];
        this.worldObjects.forEach((currObj)=>{
            currObj.update(timeElapsed, intersectables);
            controlData.push(currObj.movableBody.controlData);
        });
        return controlData;
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