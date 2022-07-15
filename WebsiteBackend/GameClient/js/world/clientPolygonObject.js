class ClientPolygonObject {
    constructor(mainScene, data) {
        console.log("Creating polygon from " + JSON.stringify(data.points));
        this.mainScene = mainScene;
        var phaserPoints = [];  // phaser points must align 0/0!
        data.points.forEach((element)=>{
            var phaserPoint = {x: element.x - data.pos.x, 
                y: element.y - data.pos.y}
            console.log("Transforming " + JSON.stringify(element) + " to phaser: " + JSON.stringify(phaserPoint));
            phaserPoints.push(phaserPoint);
        })
        console.log("DATA: " + JSON.stringify(data.pos));
        this.phaserPolygon = mainScene.add.polygon(data.pos.x, data.pos.y, phaserPoints);
        this.phaserPolygon.setStrokeStyle(2, 0x000000)
        this.hitBox = data.hitBox;
        this.phaserPolygon.displayOriginX = 0.5;
        this.phaserPolygon.displayOriginY = 0.5;
    }


    update(data) {
        if(Object.hasOwn(data, 'pos')) {
            console.log('Pos updated!')
            this.phaserPolygon.x = data.pos.x;
            this.phaserPolygon.y = data.pos.y;
        }
        if(Object.hasOwn(data, 'rot')) {
            console.log('Rot updated!')
            this.phaserPolygon.rotation = data.rot;
        }
    }
}