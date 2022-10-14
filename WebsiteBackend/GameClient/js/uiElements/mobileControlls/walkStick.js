class WalkStick extends Phaser.GameObjects.Container{
    constructor(scene) {
        super(scene);
        this.overlayScene = scene;
        this.drag = this.overlayScene.add.image(0,0, 'mobileWalkstick');
        this.add(this.drag);
    }
}