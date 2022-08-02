class MouseManager {
    constructor(mainScene) {
    this.mainScene = mainScene;

}

set strike(onStrike) {
    this.mainScene.input.on('pointerdown', onStrike);
}
}