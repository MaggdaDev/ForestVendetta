class DamageParticle extends Phaser.GameObjects.Text {
    static LIFE_SPAN = 500;
    constructor(scene, pos, damage) {
        super(scene, pos.x, pos.y, String(Math.round(damage)));
        this.setColor(0xffffff);
        this.lifeSpanRemaining = DamageParticle.LIFE_SPAN;
    }

    preUpdate(time, delta) {
        this.lifeSpanRemaining -= delta;
        this.setAlpha(this.lifeSpanRemaining / DamageParticle.LIFE_SPAN);
        if (this.lifeSpanRemaining < 0) {
            this.destroy();
            console.log("SIIS");
        }
    }
}