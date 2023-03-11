class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene', active: false });
    }

    preload() {
        this.gameScene = this.scene.get('GameScene');
        this.overlayScene = this.scene.get('OverlayScene');

        
    }

    create() {
        var text = this.add.text(this.cameras.main.centerX,this.cameras.main.centerY,"Please wait, while your progress is being saved...");
        text.setOrigin(0.5,0.5);
        text.setColor("black");
        this.gameScene.onLoadingSceneLoaded();
    }

    setupMobileControlls() {
        this.mobileController = new MobileController(this);
        this.mobileController.setupControlls();
    }

}