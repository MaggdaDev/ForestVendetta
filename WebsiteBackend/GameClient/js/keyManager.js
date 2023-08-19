class KeyManager {
    constructor(mainScene) {
        this.mainScene = mainScene;
        this.walkLeftKey = 'A';
        this.walkRightKey = 'D';
        this.jumpKey = 'SPACE';
        this.emoteKey = 'E';
    }

    set startWalkLeft(onWalkLeft) {
        this.mainScene.input.keyboard.on(this.getKeyDown(this.walkLeftKey), onWalkLeft);
    }

    set stopWalkLeft(onStopWalkLeft) {
        this.mainScene.input.keyboard.on(this.getKeyUp(this.walkLeftKey), onStopWalkLeft);
    }

    set startWalkRight(onWalkRight) {
        this.mainScene.input.keyboard.on(this.getKeyDown(this.walkRightKey), onWalkRight);
    }

    set stopWalkRight(onStopWalkRight) {
        this.mainScene.input.keyboard.on(this.getKeyUp(this.walkRightKey), onStopWalkRight);
    }

    set startJump(onStartJump) {
        this.mainScene.input.keyboard.on(this.getKeyDown(this.jumpKey), onStartJump);
    }

    set stopJump(onStopJump) {
        this.mainScene.input.keyboard.on(this.getKeyUp(this.jumpKey), onStopJump);
    }

    set emotePressed(onEmotePressed) {
        this.mainScene.input.keyboard.on(this.getKeyDown(this.emoteKey), onEmotePressed);
    }

    set emoteReleased(onEmoteReleased) {
        this.mainScene.input.keyboard.on(this.getKeyUp(this.emoteKey), onEmoteReleased);
    }

    getKeyDown(key) {
        return 'keydown-' + key;
    }

    getKeyUp(key) {
        return 'keyup-' + key;
    }
}