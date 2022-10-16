class MobileController {

    constructor(overlayScene) {
        this.overlayScene = overlayScene;
        this.lastRight = true;
    }

    setupControlls() {
        const instance = this;
        // walkstick
        this.walkStick = new WalkStick(this.overlayScene);
        this.overlayScene.add.existing(this.walkStick);
        this.resetWalkstickPosition();
        this.walkStick.setupListeners(this);

        // jumpbutton
        this.jumpButton = new JumpButton(this.overlayScene, () => instance.onStartJump(), () => instance.onEndJump());
        Phaser.Display.Align.In.BottomRight(this.jumpButton.sprite, this.overlayScene.screenZone, -1 * JumpButton.RIGHT_OFFSET, -1 * JumpButton.BOTTOM_OFFSET);

        // strikebutton
        this.strikeButton = new StrikeButton(this.overlayScene, () => instance.onStartStrike(), () => instance.onEndStrike());
        Phaser.Display.Align.In.BottomRight(this.strikeButton.sprite, this.overlayScene.screenZone, -1 * StrikeButton.RIGHT_OFFSET, -1 * (JumpButton.BOTTOM_OFFSET + JumpButton.ORIGINAL_SIZE.h*JumpButton.DISPLAY_FACT + StrikeButton.BOTTOM_OFFSET));
    }

    resetWalkstickPosition() {
        Phaser.Display.Align.In.BottomLeft(this.walkStick, this.overlayScene.screenZone, -1 * WalkStick.LEFT_OFFSET, -1 * WalkStick.BOTTOM_OFFSET);
        this.walkStick.updateStartPoint();
    }

    onStartJump() {
        MobileEventEmitter.getInstance().emit("JUMPBUTTON_START");
    }

    onEndJump() {
        MobileEventEmitter.getInstance().emit("JUMPBUTTON_END");
    }

    onStartStrike() {
        MobileEventEmitter.getInstance().emit("STRIKEBUTTON_START");
    }

    onEndStrike() {
        MobileEventEmitter.getInstance().emit("STRIKEBUTTON_END");
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