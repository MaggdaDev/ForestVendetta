class OverlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OverlayScene', active: true });
    }

    preload() {
        this.gameScene = this.scene.get('GameScene');

        // aligning on hud
        this.screenZone = this.add.zone(0, 0, this.scale.gameSize.width, this.scale.gameSize.height);
        this.screenZone.setOrigin(0, 0);
        window.addEventListener('resize', () => {
            console.log("Window resize!");
            this.screenZone.setSize(this.scale.gameSize.width, this.scale.gameSize.height);
        });

        // loading
        var loader = new Loader(this);
        loader.loadOverlayStuff();

        
    }

    create() {
        // physics info
        this.physicsInfo = new PhysicsControlInfo(this);

        // inventory
        this.inventoryHUD = new InventoryHUD(this);
        this.input.topOnly = false;

        // death overlay
        this.deathOverlay = new DeathOverlay(this);
        this.add.existing(this.deathOverlay);
        this.alignNodeCenter(this.deathOverlay);

        // controls
        if (MobileController.isMobile(this)) {
            this.input.addPointer(3);
            this.setupMobileControlls();
        }

        // adding control elements
        var leaveButton = new LeaveButton(this, this.gameScene.networkManager);
        this.add.existing(leaveButton);

        this.gameScene.onOverlaySceneLoaded();
        this.created = true;


    }

    initRespawn(respawnTime) {
        this.deathOverlay.startRespawn(respawnTime);
    }

    /**
     * 
     * @param {number} delta time elapsed in millis
     * @description called by game scene client update loop
     */
    clientUpdate(delta) {
        if(this.created) {
            if(this.deathOverlay.visible) {
                this.deathOverlay.updateRespawn(delta);
            }
        }
    }

    alignNodeCenter(node) {
        Phaser.Display.Align.In.Center(node, this.screenZone);
    }

    setupMobileControlls() {
        this.mobileController = new MobileController(this);
        this.mobileController.setupControlls();
    }

}