
class ClientPlatform {

    constructor(scene, data) {
        this.phaserRect = scene.add.rectangle(data.hitBox.pos.x, data.hitBox.pos.y, data.hitBox.width, data.hitBox.height);
        this.phaserRect.setStrokeStyle(2, 0x000000)
        this.hitBox = data.hitBox;
    }

    update(data) {
        if(Object.hasOwn(data, 'pos')) {
            //console.log('Pos updated!')
            this.phaserRect.x = data.pos.x;
            this.phaserRect.y = data.pos.y;
        }
    }
}
