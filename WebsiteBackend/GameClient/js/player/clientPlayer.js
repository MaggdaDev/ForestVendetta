
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

    }
    
    update(data) {
        this.sprite.x = data.pos.x;
        this.sprite.y = data.pos.y;

        if (this.displayMode == 'hitbox') {
            this.sprite.displayWidth = data.width;
            this.sprite.displayHeight = data.height;
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
                frames: this.mainScene.anims.generateFrameNumbers('hotzenplotz', { frames: [3,4,5,6,7,8,9,10] }),
                frameRate: 8,
                repeat: -1
            };
            this.mainScene.anims.create(walk);

            var instance = this;
            
        }
    }
}