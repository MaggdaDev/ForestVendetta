class ParticleManager {
    constructor(scene) {
        this.mainScene = scene;

    }

    /**
     * 
     * @param {string} playerID 
     * @param {string} weaponRarity 
     * @param {Object} originPos 
     * @param {ClientPlayer} targetPlayer 
     */
    emitDropParticle(playerID, weaponRarity, originPos, targetPlayer) {
        const part = new DropParticle(this.mainScene, weaponRarity, originPos, targetPlayer);
        this.mainScene.add.existing(part);
    }

    damageParticle(pos, damage) {
        var part = new DamageParticle(this.mainScene, pos, damage);
        this.mainScene.add.existing(part);
        this.mainScene.physics.add.existing(part);
        part.body.velocity.y = -400;
        part.body.velocity.x = Math.sign(Math.random() - 0.5) * 100;
        part.body.setGravityY(400);

    }


}

class DropParticle extends Phaser.GameObjects.Container {
    static COLLECT_RADIUS = 70;
    static COLLECT_TIME_SECONDS = 2;
    static LINE_LENGTH = 200;
    static RUBBER_PULL_CONST = 1200;
    static FRIC_FORCE = 800;
    static ADD_FRIC_PER_SEC = 100;
    constructor(scene, rarity, originPos, targetPlayer) {
        super(scene, originPos.x, originPos.y);
        this.mass = 50;
        this.pullTime = 1000;
        this.collectTime = DropParticle.COLLECT_TIME_SECONDS;
        switch (rarity) {
            case "COMMON":
                this.mass = 40;
                this.pullTime = 2;
                this.collectTime = 1;
                break;
            case "EPIC":
                this.mass = 200;
                this.pullTime = 2;
                break;
            case "LEGENDARY":
                this.mass = 300;
                this.pullTime = 3;
                break;


            default:
                throw new Error("Unkown rarity: " + rarity);
                break;
        }
        this.mainScene = scene;
        this.pos = Vector.from(originPos);
        this.spd = new Vector(0, this.mass * (-20));
        this.force = new Vector(0, 0);
        this.forceAbs = 0;

        this.targetPlayer = targetPlayer;
        this.rarity = rarity;
        this.fill = this.mainScene.add.rectangle(0, 0, 50, 50, "black");
        this.add(this.fill);
        this.stopwatch = 0;
        this.collectTimer = 0;
    }

    preUpdate(time, delta) {
        this.stopwatch += delta / 1000;
        const diffToPlayer = Vector.subtractFrom(this.targetPlayer.getPos(), this.pos);
        const lineLength = this.getLineLength();
        console.log("Diff to player: " + diffToPlayer.abs);
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
            this.destroy();
        }
    }

    getCurrFricForce() {
        return DropParticle.FRIC_FORCE + Math.pow(this.stopwatch, 1.5) * DropParticle.ADD_FRIC_PER_SEC;
    }

    getLineLength() {
        return DropParticle.LINE_LENGTH *(1 - this.stopwatch / this.pullTime );
    }

    set spritePos(p) {
        this.x = p.x;
        this.y = p.y;
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
        this.setAlpha(this.lifeSpanRemaining / DamageParticle.LIFE_SPAN);
        if (this.lifeSpanRemaining < 0) {
            this.destroy();
            console.log("SIIS");
        }
    }
}