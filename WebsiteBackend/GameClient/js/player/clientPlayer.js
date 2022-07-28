
class ClientPlayer {

    /**
     * 
     * @param {Phaser.Scene} scene 
     */
    constructor(scene, id, isProtagonist) {
        this.mainScene = scene;
        this.displayMode = 'sprite';
        this.id = id;
        this.isProtagonist = isProtagonist;
        this.isContact = false;
        this.isWalkingRight = false;
        this.isWalkingLeft = false;
    }

    update(data) {
        this.sprite.x = data.pos.x;
        this.sprite.y = data.pos.y;

        if (this.displayMode == 'hitbox') {
            this.sprite.displayWidth = data.width;
            this.sprite.displayHeight = data.height;
        }
        if (data.isContact && (!this.isContact)) {
            this.isContact = true;
            if (this instanceof ClientProtagonist) {
                if (this.isWalkingLeft) {
                    this.onStartWalkLeft(this);
                } else if (this.isWalkingRight) {
                    this.onStartWalkRight(this);
                }
            }
        } else if ((!data.isContact) && this.isContact) {
            this.isContact = false;
            this.stopAnimation();
        }
        //console.log('Updated position: ' + JSON.stringify(data.hitBox.pos));
    }

    remove() {
        this.sprite.destroy(true);
    }



    generateSprite(x, y, w, h) {
        console.log("Generating protagonist sprite...");
        console.log("Display mode: " + this.displayMode);
        if (this.displayMode === 'hitbox') {
            this.sprite = this.mainScene.add.rectangle(x, y, w, h);
            if (this.isProtagonist) {
                this.sprite.setStrokeStyle(2, 0x0000ff)
            } else {
                this.sprite.setStrokeStyle(2, 0xff0000)
            }
        } else if (this.displayMode === 'sprite') {
            this.sprite = this.mainScene.add.sprite(x, y, 'hotzenplotz');
            this.sprite.displayWidth = h;
            this.sprite.displayHeight = h;
            const walk = {
                key: 'walk',
                frames: this.mainScene.anims.generateFrameNumbers('hotzenplotz', { frames: [2, 3, 4, 5, 6, 7, 8, 9] }),
                frameRate: 8,
                repeat: -1
            };
            const startWalk = {
                key: 'startWalk',
                frames: this.mainScene.anims.generateFrameNumbers('hotzenplotz', { frames: [0, 1] }),
                frameRate: 8,
                repeat: 0
            }
            this.mainScene.anims.create(walk);
            this.mainScene.anims.create(startWalk);

            var instance = this;

        }
    }
}