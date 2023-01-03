class ClientFrog extends ClientMob {
    constructor(id, pos, width, height, scene, maxHealth) {
        super(id, scene, new HealthBar(scene, maxHealth, pos.x, pos.y, height * (-0.6), "MOB"), pos);
        //this.sprite = scene.add.rectangle(pos.x, pos.y, width, height);
        //this.sprite.setStrokeStyle(2, 0x90ee90);
        this.sprite = scene.add.sprite(pos.x, pos.y, "frog");
        this.sprite.displayWidth = 298;
        this.sprite.displayHeight = 400;

        this.oldSpd = { x: 0, y: 0 };
        this.oldIsContact = false;
        var instance = this;
        this.landed = false;
        super.addOnServerUpdate(this.onServerUpdate);

        this.setupAnimations();
    }

    setupAnimations() {
        const frogJump = {
            key: 'frogJump',
            frames: this.mainScene.anims.generateFrameNumbers('frog', { frames: [1, 2] }),
            frameRate: 8,
            repeat: 0
        };
        const frogLand = {
            key: 'frogLand',
            frames: this.mainScene.anims.generateFrameNumbers('frog', { frames: [3, 4, 0] }),
            frameRate: 8,
            repeat: 0
        }
        this.mainScene.anims.create(frogJump);
        this.mainScene.anims.create(frogLand);
    }

    onServerUpdate(data, instance) {
        var spdDiff = Math.sqrt(Math.pow(data.spd.x - instance.oldSpd.x, 2) + Math.pow(data.spd.y - instance.oldSpd.y, 2));
        if (spdDiff > 50) {
            if (Math.pow(data.spd.x, 2) + Math.pow(data.spd.y, 2) > Math.pow(instance.oldSpd.x, 2) + Math.pow(instance.oldSpd.y, 2)) {
                if (instance.landed) {
                    instance.sprite.play("frogJump");
                    instance.landed = false;
                }
            } else {
                if (!instance.landed) {
                    instance.sprite.play("frogLand");
                    instance.landed = true;
                }
            }
        }

        instance.oldIsContact = data.isContact;
        instance.oldSpd.x = data.spd.x;
        instance.oldSpd.y = data.spd.y;
    }
}