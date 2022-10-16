class JumpButton extends MobileButton {
    static ORIGINAL_SIZE = {w: 175, h: 89};
    static DISPLAY_FACT = 1;
    static BOTTOM_OFFSET = 55;
    static RIGHT_OFFSET = 100;
    constructor(scene, onClick, onRelease) {
        super(scene, "mobileJumpButton", onClick, onRelease);
        this.sprite.displayWidth = JumpButton.DISPLAY_FACT * JumpButton.ORIGINAL_SIZE.w;
        this.sprite.displayHeight = JumpButton.DISPLAY_FACT * JumpButton.ORIGINAL_SIZE.h;
    }
}