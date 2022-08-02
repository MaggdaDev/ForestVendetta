
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

    strike(instance) {
        instance.sprite.playHeavySwordStrike();
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
            this.sprite = new PlayerSprite(this.mainScene, x, y, w, h);
            this.mainScene.add.existing(this.sprite);

        }
    }
}