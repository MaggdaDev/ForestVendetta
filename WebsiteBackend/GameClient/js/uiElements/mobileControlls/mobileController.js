class MobileController {

    constructor(overlayScene) {
        this.overlayScene = overlayScene;
        this.lastRight = true;
    }

    setupControlls() {
        this.walkStick = new WalkStick(this.overlayScene);
        this.overlayScene.add.existing(this.walkStick);
        this.resetWalkstickPosition();
        this.walkStick.setupListeners(this);
    }

    resetWalkstickPosition() {
        Phaser.Display.Align.In.BottomLeft(this.walkStick, this.overlayScene.screenZone, -1 * WalkStick.LEFT_OFFSET, -1 * WalkStick.BOTTOM_OFFSET);
        this.walkStick.updateStartPoint();
    }

    onDragStart(data) {
        if (Math.abs(data.position.x - this.walkStick.startPoint.x) < WalkStick.MAX_OFF) {
            this.walkStick.x = data.position.x;
        }
        if (data.position.x > this.walkStick.startPoint.x) {
            if (!this.lastRight) {
                this.lastRight = true;
                MobileEventEmitter.getInstance().emit("WALKSTICK_RELEASE_LEFT");
            } else {
                MobileEventEmitter.getInstance().emit("WALKSTICK_RIGHT");
            }

        } else {
            if (this.lastRight) {
                this.lastRight = false;
                MobileEventEmitter.getInstance().emit("WALKSTICK_RELEASE_RIGHT");
            } else {
                MobileEventEmitter.getInstance().emit("WALKSTICK_LEFT");
            }
        }
    }

    onDragEnd(data) {
        this.resetWalkstickPosition();
        if (this.lastRight) {
            MobileEventEmitter.getInstance().emit("WALKSTICK_RELEASE_RIGHT");
        } else {
            MobileEventEmitter.getInstance().emit("WALKSTICK_RELEASE_LEFT");
        }
    }

    static isMobile(scene) {
        return !(scene.game.device.os.desktop);
    }
}