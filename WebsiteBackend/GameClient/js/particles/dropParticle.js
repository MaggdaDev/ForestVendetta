class DropParticle extends Phaser.GameObjects.Container {
    static COLLECT_RADIUS = 70;
    static COLLECT_TIME_SECONDS = 2;
    static LINE_LENGTH = 200;
    static RUBBER_PULL_CONST = 1200;
    static FRIC_FORCE = 800;
    static ADD_FRIC_PER_SEC = 100;
    constructor(scene, rarity, originPos, targetPlayer, rarityConfig) {
        super(scene, originPos.x, originPos.y);
        this.mainScene = scene;
        this.mass = 50;
        this.pullTime = 1;

        this.collectTime = DropParticle.COLLECT_TIME_SECONDS;
        if (rarityConfig[rarity].drop_animation.mass !== undefined) {
            this.mass = rarityConfig[rarity].drop_animation.mass;
        }
        if (rarityConfig[rarity].drop_animation.pulltime !== undefined) {
            this.pullTime = rarityConfig[rarity].drop_animation.pulltime;
        }
        this.phaserColor = parseInt(rarityConfig[rarity].display.color.replace("#", ""), 16);
        this.dropShade = new DropShade(this.mainScene, this.phaserColor, originPos);

        
        switch (rarityConfig[rarity].drop_animation.trace) {
            case 2:
                this.particles = this.mainScene.add.particles("dropShade");
                
                this.emitter = this.particles.createEmitter({
                    speed: 200,
                    gravity: { x: 0, y: 200 },
                    follow: this,
                    scale: { start: 0.1, end: 0.7 },
                    alpha: { start: 1, end: 0 }

                });
                this.emitter.setTint(this.phaserColor);
                break;
            case 1:
                this.particles = this.mainScene.add.particles("dropParticles");
                this.emitter = this.particles.createEmitter({
                    speed: 100,
                    gravity: { x: 0, y: 100 },
                    follow: this,
                    scale: { start: 1, end: 1 },
                    alpha: { start: 1, end: 0 },
                    frequency: 80

                });
                this.emitter.setTint(this.phaserColor);
                break;
        }
        

        this.mainScene = scene;
        this.pos = Vector.from(originPos);
        this.spd = new Vector(0, this.mass * (-20));
        this.force = new Vector(0, 0);
        this.forceAbs = 0;

        this.targetPlayer = targetPlayer;
        this.rarity = rarity;
        this.fill = this.mainScene.add.image(0, 0, "dropIcon");
        this.add(this.fill);
        this.add(this.dropShade);
        this.stopwatch = 0;
        this.collectTimer = 0;
    }



    preUpdate(time, delta) {
        this.stopwatch += delta / 1000;
        const diffToPlayer = Vector.subtractFrom(this.targetPlayer.getPos(), this.pos);
        const lineLength = this.getLineLength();
        //console.log("Diff to player: " + diffToPlayer.abs);
        const forceMult = DropParticle.RUBBER_PULL_CONST * Math.max(0, diffToPlayer.abs - lineLength);

        this.force.setTo(Vector.multiply(diffToPlayer.dirVec, forceMult));
        const fricForce = Vector.multiply(this.spd.dirVec, (-1) * Math.pow(this.spd.abs, 0.7) * this.getCurrFricForce());
        this.force.incrementBy(fricForce);
        this.acc = Vector.multiply(this.force, 1 / this.mass);
        this.acc.y += 400;
        this.spd.incrementBy(Vector.multiply(this.acc, delta / 1000));


        this.pos.x += this.spd.x * delta / 1000;
        this.pos.y += this.spd.y * delta / 1000;
        this.spritePos = this.pos;

        if (diffToPlayer.abs < DropParticle.COLLECT_RADIUS) {
            this.collectTimer += delta / 1000;
        } else {
            this.collectTimer = 0;
        }

        if (this.collectTimer > this.collectTime) {
            this.deconstruct();
        }
    }

    deconstruct() {
        this.dropShade.destroy();
        this.destroy();
        if (this.emitter !== undefined && this.emitter !== null) {
            this.emitter.explode(50);
            this.emitter.stop();
            this.emitter.onParticleDeath((particle) => {
                if(this.emitter.getAliveParticleCount() === 0) {
                    console.log("All particles dead. Destroying particles object");
                    this.particles.destroy();
                }
            })
        }
    }

    getCurrFricForce() {
        return DropParticle.FRIC_FORCE + Math.pow(this.stopwatch, 1.5) * DropParticle.ADD_FRIC_PER_SEC;
    }

    getLineLength() {
        return DropParticle.LINE_LENGTH * (1 - this.stopwatch / this.pullTime);
    }

    set spritePos(p) {
        this.x = p.x;
        this.y = p.y;
    }
}

class DropShade extends Phaser.GameObjects.Image {
    static MIN_ALPHA = 0;
    static MAX_ALPHA = 1;
    static MAX_SIZE = 160;
    static PULSATION_W = 4;
    constructor(mainScene, phaserColor) {
        super(mainScene, 0, 0, "dropShade");
        this.mainScene = mainScene;
        this.mainScene.add.existing(this);
        this.updateDisplaySize(0);
        this.setTint(phaserColor);
    }

    updateDisplaySize(s) {
        this.setDisplaySize(s, s);
    }

    preUpdate(time, delta) {
        const fact = Math.pow(Math.tan(1), 0.5) - Math.pow(Math.abs(Math.sin(DropShade.PULSATION_W * time / 1000)), 0.5);
        this.updateDisplaySize(DropShade.MAX_SIZE * fact);
        this.alpha = DropShade.MIN_ALPHA + (DropShade.MAX_ALPHA - DropShade.MIN_ALPHA) * fact;
        this.rotation = DropShade.PULSATION_W * time / 1000 + Math.sin(DropShade.PULSATION_W * time / 1000);

    }
}