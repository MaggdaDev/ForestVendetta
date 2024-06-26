class PlayerController {
    constructor(owner, isMobile) {
        this.owner = owner;
        if (isMobile) {
            this.setupMobileEvents();
        } else {
            this.setupKeyEvents();
        }
    }

    setupKeyEvents() {
        var instance = this;

        this.isLeftDown = false;
        this.isRightDown = false;
        this.owner.mainScene.keyManager.startWalkLeft = () => this.startWalkLeft(instance);
        this.owner.mainScene.keyManager.stopWalkLeft = () => this.stopWalkLeft(instance);
        this.owner.mainScene.keyManager.startWalkRight = () => this.startWalkRight(instance);
        this.owner.mainScene.keyManager.stopWalkRight = () => this.stopWalkRight(instance);
        this.owner.mainScene.keyManager.startJump = () => this.startJump(instance);
        this.owner.mainScene.keyManager.stopJump = () => this.stopJump(instance);

        this.owner.mainScene.mouseManager.strike = () => this.strike(instance);
    }

    setupMobileEvents() {
        var instance = this;

        this.isLeftDown = false;
        this.isRightDown = false;
        MobileEventEmitter.getInstance().on('WALKSTICK_RIGHT', () => this.startWalkRight(instance));
        MobileEventEmitter.getInstance().on('WALKSTICK_LEFT', () => this.startWalkLeft(instance));
        MobileEventEmitter.getInstance().on('WALKSTICK_RELEASE_RIGHT', () => this.stopWalkRight(instance));
        MobileEventEmitter.getInstance().on('WALKSTICK_RELEASE_LEFT', () => this.stopWalkLeft(instance));

        MobileEventEmitter.getInstance().on('JUMPBUTTON_START', ()=> this.startJump(instance));
        MobileEventEmitter.getInstance().on('JUMPBUTTON_END', ()=> this.stopJump(instance));

        MobileEventEmitter.getInstance().on('STRIKEBUTTON_START', ()=> this.strike(instance));
    }

    get clientProtagonist() {
        return this.owner.mainScene.clientProtagonist;
    }

    strike(instance) {
        console.log("Strike!");
        instance.clientProtagonist.strike(instance.clientProtagonist);
    }

    startWalkLeft(instance) {
        if (!instance.isLeftDown) {
            instance.owner.mainScene.networkManager.sendPlayerControl(PlayerControls.START_WALK_LEFT);
            instance.isLeftDown = true;
            instance.clientProtagonist.onStartWalkLeft(instance.clientProtagonist);
        }
    }

    stopWalkLeft(instance) {
        instance.owner.mainScene.networkManager.sendPlayerControl(PlayerControls.STOP_WALK_LEFT);
        instance.isLeftDown = false;
        instance.clientProtagonist.onStopWalkLeft(instance.clientProtagonist);
    }

    startWalkRight(instance) {
        if (!instance.isRightDown) {
            instance.owner.mainScene.networkManager.sendPlayerControl(PlayerControls.START_WALK_RIGHT);
            instance.isRightDown = true;
            instance.clientProtagonist.onStartWalkRight(instance.clientProtagonist);
        }
    }

    stopWalkRight(instance) {
        instance.owner.mainScene.networkManager.sendPlayerControl(PlayerControls.STOP_WALK_RIGHT);
        instance.isRightDown = false;
        instance.clientProtagonist.onStopWalkRight(instance.clientProtagonist);
    }

    startJump(instance) {
        instance.owner.mainScene.networkManager.sendPlayerControl(PlayerControls.START_JUMP);
    }

    stopJump(instance) {
        instance.owner.mainScene.networkManager.sendPlayerControl(PlayerControls.STOP_JUMP);
    }

}