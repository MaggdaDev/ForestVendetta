
class ClientPlatform {

    constructor(scene, data) {
        this.phaserRect = scene.add.rectangle(data.x, data.y, data.w, data.h);
        this.phaserRect.setStrokeStyle(2, 0x000000)
    }
}
