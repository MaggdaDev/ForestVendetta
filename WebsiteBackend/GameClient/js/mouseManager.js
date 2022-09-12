class MouseManager {
    constructor(mainScene) {
    this.mainScene = mainScene;

}

/**
 * @param {function(pointer, gameObject, dx, dy, dz)} onMouseScroll
 */
set mouseScroll(onMouseScroll) {
    this.mainScene.input.on('wheel', (pointer, gameObject, dx, dy, dz) => onMouseScroll(pointer, gameObject, dx, dy, dz))
}

set strike(onStrike) {
    this.mainScene.input.on('pointerdown', onStrike);
}
}