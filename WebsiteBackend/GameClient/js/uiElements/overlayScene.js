class OverlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OverlayScene', active: true });
    }

    preload() {
        

    }

    create() {
        // physics info
        this.physicsInfo = new PhysicsControlInfo(this);

        // screen zone for aligning objects
        this.screenZone = this.add.zone(0, 0, this.scale.gameSize.width, this.scale.gameSize.height);
        this.screenZone.setOrigin(0,0);
        window.addEventListener('resize', () => {
            console.log("Window resize!");
            this.screenZone.setSize(this.scale.gameSize.width, this.scale.gameSize.height);
        });

        // hotbar
        this.hotBar = new HotBar(this, 500, 500);
        this.add.existing(this.hotBar.sprite);
    }
}