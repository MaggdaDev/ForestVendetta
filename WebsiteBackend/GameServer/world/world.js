const Platform = require("./platform");

class World {
    constructor() {
        this.worldObjects = [];
    }

    buildWorld() {
        console.log("Building world...")

        this.addNewPlatform(500, 500, 500, 50);
        this.addNewPlatform(500, 300, 980, 40);

        console.log("World built.")
    }

    addNewPlatform(x,y,w,h) {
        this.addWorldObject(new Platform(x,y,w,h));
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