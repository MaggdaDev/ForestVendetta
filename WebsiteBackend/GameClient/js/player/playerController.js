class PlayerController {
    constructor(owner) {
        this.owner = owner;
        this.setupKeyEvents();
    }

    setupKeyEvents() {
        var instance = this;

        this.isLeftDown = false;
        this.isRightDown = false;
        this.owner.mainScene.keyManager.startWalkLeft = ()=> this.startWalkLeft(instance);
        this.owner.mainScene.keyManager.stopWalkLeft = ()=> this.stopWalkLeft(instance);
        this.owner.mainScene.keyManager.startWalkRight = ()=> this.startWalkRight(instance);
        this.owner.mainScene.keyManager.stopWalkRight = ()=> this.stopWalkRight(instance);
        this.owner.mainScene.keyManager.jump = ()=> this.jump(instance);
    }

    startWalkLeft(instance) {
        if(!instance.isLeftDown) {
            instance.owner.mainScene.networkManager.sendPlayerControl(PlayerControls.START_WALK_LEFT);
            instance.isLeftDown = true;
        }
    }

    stopWalkLeft(instance) {
        instance.owner.mainScene.networkManager.sendPlayerControl(PlayerControls.STOP_WALK_LEFT);
        instance.isLeftDown = false;
    }

    startWalkRight(instance) {
        if(!instance.isRightDown) {
            instance.owner.mainScene.networkManager.sendPlayerControl(PlayerControls.START_WALK_RIGHT);
            instance.isRightDown = true;
        }
    }

    stopWalkRight(instance) {
        instance.owner.mainScene.networkManager.sendPlayerControl(PlayerControls.STOP_WALK_RIGHT);
        instance.isRightDown = false;
    }

    jump(instance) {
        instance.owner.mainScene.networkManager.sendPlayerControl(PlayerControls.JUMP);
    }


}