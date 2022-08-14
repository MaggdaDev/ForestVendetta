class WeaponCooldownIndicator extends Phaser.GameObjects.Container{
    static POSITION_OFFSET = {x: 0, y: -90};
    static RADIUS = 10;
    static ARC_WIDTH = 3;
    static COLORS = {CIRCLE: 0xd3d3d3, ARC: 0x63666A};
    constructor(mainScene) {
        super(mainScene, WeaponCooldownIndicator.POSITION_OFFSET.x, WeaponCooldownIndicator.POSITION_OFFSET.y);
        this.mainScene = mainScene;

        this.circle = this.mainScene.add.circle(0,0,WeaponCooldownIndicator.RADIUS);
        this.circle.isStroked = true;
        this.circle.strokeColor = WeaponCooldownIndicator.COLORS.CIRCLE;
        this.add(this.circle);

        this.arc = this.mainScene.add.arc(0,0, WeaponCooldownIndicator.RADIUS, -90, 270);
        this.arc.setStrokeStyle(WeaponCooldownIndicator.ARC_WIDTH, WeaponCooldownIndicator.COLORS.ARC);
        this.arc.setClosePath(false);
        this.add(this.arc);

        this.setVisible(false);
        this.startCooldown(1000);
    }

    /**
     * 
     * @param {number} cooldown - cooldown in s
     */
    startCooldown(cooldown) {
        this.arc.startAngle = -90;
        this.setVisible(true);
        this.mainScene.add.tween({
            targets: this.arc,
            duration: cooldown*1000,
            startAngle: {from: -90, to: 270},
            onComplete: ()=>this.endCooldown()
        });
    }

    endCooldown() {
        this.setVisible(false);
    }
}