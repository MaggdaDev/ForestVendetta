class KeyManager {
    constructor(mainScene) {
        this.mainScene = mainScene;
        this.walkLeftKey = 'A';
        this.walkRightKey = 'D';
        this.jumpKey = 'SPACE';
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

    set jump(onJump) {
        this.mainScene.input.keyboard.on(this.getKeyDown(this.jumpKey), onJump);
    }

    getKeyDown(key) {
        return 'keydown-' + key;
    }

    getKeyUp(key) {
        return 'keyup-' + key;
    }
}