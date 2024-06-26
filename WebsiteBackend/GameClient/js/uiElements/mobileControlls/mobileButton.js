class MobileButton {
    constructor(scene, imageName, onClick, onRelease) {
        this.overlayScene = scene;
        this.sprite = scene.add.image(0,0,imageName);
        this.sprite.setInteractive();
        this.sprite.on('pointerdown', onClick);
        this.sprite.on('pointerup', onRelease);
    }
}