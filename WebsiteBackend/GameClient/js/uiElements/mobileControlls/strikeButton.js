class StrikeButton extends MobileButton {
    static RIGHT_OFFSET = 100;
    static BOTTOM_OFFSET = 50;

    constructor(scene, onClick, onRelease) {
        super(scene, "mobileStrikeButton", onClick, onRelease);
    }
}