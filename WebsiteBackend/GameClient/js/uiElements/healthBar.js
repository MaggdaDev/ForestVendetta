class HealthBar extends Phaser.GameObjects.Container {
    static BAR_HEIGHT = 10;
    static BORDER_WIDTH = 1;
    static HITBOX_COLORS = {
        player: 0xff3333,
        mob: 0x00b300
    }
    /**
     * 
     * @param {Scene} scene 
     * @param {number} maxHealth 
     * @param {number} x 
     * @param {number} y 
     * @param {number} yOffset 
     * @param {string} type - "PLAYER" or "MOB" 
     */
    constructor(scene, maxHealth, x, y, yOffset, type) {
        super(scene, x, y + yOffset);
        this.yOffset = yOffset;
        this.mainScene = scene;
        this.maxHealth = maxHealth;
        this.totWidth = 5 + 20 * Math.log(maxHealth);
        this.maxFillWidth = this.totWidth - 2 * HealthBar.BORDER_WIDTH;
        this.currentFillWidth = this.maxFillWidth;
        this.border = this.mainScene.add.rectangle(0, 0, this.totWidth, HealthBar.BAR_HEIGHT);
        this.border.setStrokeStyle(HealthBar.BORDER_WIDTH, 0x000000);
        switch (type) {
            case "PLAYER":
                this.fillFill = HealthBar.HITBOX_COLORS.player;
                break;
            case "MOB":
                this.fillFill = HealthBar.HITBOX_COLORS.mob;
                break;
            default:
                console.error("Unknown hitbox type: " + type);
        }
        this.fill = this.mainScene.add.rectangle(0, 0, this.maxFillWidth, HealthBar.BAR_HEIGHT - 2 * HealthBar.BORDER_WIDTH, this.fillFill);
        this.fill.displayOriginX = 0;
        this.currentHealth = maxHealth;

        this.add(this.border);
        this.add(this.fill);

        this.mainScene.add.existing(this);
    }

    update(x, y, hp) {
        this.x = x;
        this.y = y + this.yOffset;
        if (hp < 0) hp = 0
        this.currentHealth = hp;
        this.currentFillWidth = (hp / this.maxHealth) * this.maxFillWidth;
        this.fill.width = this.currentFillWidth;
        this.fill.x = -0.5 * this.maxFillWidth;//(this.currentFillWidth - this.maxFillWidth)/2;

    }

}