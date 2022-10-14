class MobileController {
    constructor(overlayScene) {
        this.overlayScene = overlayScene;
    }

    setupControlls() {
        this.walkStick = new WalkStick(this.overlayScene);
        this.overlayScene.add.existing(this.walkStick);
        Phaser.Display.Align.In.BottomLeft(this.walkStick, this.overlayScene.screenZone, -100, -100);
    }
}