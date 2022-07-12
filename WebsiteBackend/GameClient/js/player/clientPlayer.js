
class ClientPlayer {

    /**
     * 
     * @param {Phaser.Scene} scene 
     */
    constructor(scene, id, isProtagonist) {
        this.mainScene = scene;
        this.displayMode = 'hitbox';
        this.id = id;
        this.isProtagonist = isProtagonist;

    }
    
    update(data) {
        this.sprite.x = data.hitBox.pos.x;
        this.sprite.y = data.hitBox.pos.y;

        if (this.displayMode == 'hitbox') {
            this.sprite.displayWidth = data.hitBox.width;
            this.sprite.displayHeight = data.hitBox.height;
        }
        //console.log('Updated position: ' + JSON.stringify(data.hitBox.pos));
    }

    remove() {
        this.sprite.destroy(true);
    }

    generateSprite(x, y, w, h) {
        console.log("Generating protagonist sprite...");
        console.log("Display mode: " + this.displayMode);
        if (this.displayMode = 'hitbox') {
            this.sprite = this.mainScene.add.rectangle(x, y, w, h);
            if (this.isProtagonist) {
                this.sprite.setStrokeStyle(2, 0x0000ff)
            } else {
                this.sprite.setStrokeStyle(2, 0xff0000)
            }
        } else if (displayMode = 'sprite') {
            this.sprite = this.mainScene.add.sprite(x, y, 'woman');
            this.sprite.displayWidth = h;
            this.sprite.displayHeight = h;
            const squeeze = {
                key: 'squeeze',
                frames: this.mainScene.anims.generateFrameNumbers('woman', { frames: [0, 1, 2] }),
                frameRate: 10,
                repeat: false
            };
            const release = {
                key: 'release',
                frames: this.mainScene.anims.generateFrameNumbers('woman', { frames: [2, 1, 0] }),
                frameRate: 10,
                repeat: false
            };
            const walk = {
                key: 'walk',
                frames: this.mainScene.anims.generateFrameNumbers('woman', { frames: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13] }),
                frameRate: 10,
                repeat: -1
            };
            this.mainScene.anims.create(squeeze);
            this.mainScene.anims.create(release);
            this.mainScene.anims.create(walk);

            var instance = this;
            this.mainScene.input.keyboard.on('keydown-SPACE', function () {
                instance.sprite.play('squeeze');
                console.log('squeeze');
            });
            this.mainScene.input.keyboard.on('keyup-SPACE', function () {
                instance.sprite.play('release');
            });
            this.mainScene.input.keyboard.on('keydown-RIGHT', function () {
                instance.sprite.scaleX = -1 * Math.abs(instance.sprite.scaleX);
                instance.sprite.scakeY = -1 * Math.abs(instance.sprite.scaleY);
                instance.sprite.play('walk');
                console.log(this);

            });
            this.mainScene.input.keyboard.on('keyup-RIGHT', function () {
                instance.sprite.stop();
                instance.sprite.setFrame(0);

            });
            this.mainScene.input.keyboard.on('keydown-LEFT', function () {
                instance.sprite.scaleX = Math.abs(instance.sprite.scaleX);
                instance.sprite.scakeY = Math.abs(instance.sprite.scaleY);
                instance.sprite.play('walk');

            });
            this.mainScene.input.keyboard.on('keyup-LEFT', function () {
                instance.sprite.stop();
                instance.sprite.setFrame(0);

            });
        }
    }
}