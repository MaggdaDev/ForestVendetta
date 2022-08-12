class ClientFrog extends ClientMob{
    constructor(id, pos, width, height, scene, maxHealth) {
        super(id, scene, new HealthBar(scene, maxHealth, pos.x, pos.y, height * (-0.6), "MOB"));
        //this.sprite = scene.add.rectangle(pos.x, pos.y, width, height);
        //this.sprite.setStrokeStyle(2, 0x90ee90);
        this.sprite = scene.add.image(pos.x, pos.y, "frog");
        this.sprite.displayWidth = 298;
        this.sprite.displayHeight = 206;
    }
}