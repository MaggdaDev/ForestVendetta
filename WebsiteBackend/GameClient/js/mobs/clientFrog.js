class ClientFrog extends ClientMob{
    constructor(id, pos, width, height, scene) {
        super(id, scene);
        this.sprite = scene.add.rectangle(pos.x, pos.y, width, height);
        this.sprite.setStrokeStyle(2, 0x90ee90);
    }
}