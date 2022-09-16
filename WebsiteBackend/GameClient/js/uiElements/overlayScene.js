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
        this.load.setBaseURL('GameClient');
        this.load.html('itemHoverInfo', 'html/itemHoverInfo.html');
        this.load.css('ingameUiStyle', 'css/ingameUiStyle.css');

    }

    create() {
        // physics info
        this.physicsInfo = new PhysicsControlInfo(this);

        // inventory
        this.inventoryHUD = new InventoryHUD(this);
        this.input.topOnly = false;





    }
}