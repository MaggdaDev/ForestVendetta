class WalkStick extends Phaser.GameObjects.Container {
    static HEIGHT = 300;
    static LEFT_OFFSET = 200;
    static BOTTOM_OFFSET = 180;
    static WIDTH = 150;

    static MAX_OFF = 150;

    constructor(scene) {
        super(scene);
        this.overlayScene = scene;
        this.drag = this.overlayScene.add.image(0, 0, 'mobileWalkstick');
        this.drag.displayWidth = WalkStick.WIDTH;
        this.drag.displayHeight = WalkStick.HEIGHT;
        this.drag.setInteractive();
        this.overlayScene.input.setDraggable(this.drag);
        this.add(this.drag);

        this.x = 0;
        this.y = 0;
        this.updateStartPoint(0, 0);
    }

    updateStartPoint() {
        this.startPoint = { x: this.x, y: this.y };
    }

    setupListeners(mobileController) {
        this.drag.on('drag', (data) => mobileController.onDragStart(data));
        this.drag.on('dragend', (data) => mobileController.onDragEnd(data));
    }
}