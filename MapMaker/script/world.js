class World {
    constructor() {
        this.worldObjects = [];
    }

    addWorldObject(obj) {
        this.worldObjects.push(obj);
    }

    drawWorld(canvas) {
        this.worldObjects.forEach((curr)=>{
            curr.draw(canvas);
        });
    }
}