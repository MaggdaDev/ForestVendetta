class ParticleManager {
    constructor(scene) {
        this.mainScene = scene;
        
    }

    damageParticle(pos, damage) {
        var part = new DamageParticle(this.mainScene, pos, damage);
        this.mainScene.add.existing(part);
        this.mainScene.physics.add.existing(part);
        part.body.velocity.y = -200;
        part.body.velocity.x = Math.sign(Math.random()-0.5) * 100;
        part.body.setGravityY(400);

    }

    
}

class DamageParticle extends Phaser.GameObjects.Text {
    static LIFE_SPAN = 500;
    constructor(scene, pos, damage) {
        super(scene, pos.x, pos.y, String(Math.round(damage)));
        this.setColor(0xffffff);
        this.lifeSpanRemaining = DamageParticle.LIFE_SPAN;
    }

    preUpdate(time, delta) {
        this.lifeSpanRemaining -= delta;
        this.setAlpha(this.lifeSpanRemaining/DamageParticle.LIFE_SPAN);
        if(this.lifeSpanRemaining < 0) {
            this.destroy();
            console.log("SIIS");
        }
    }
 }