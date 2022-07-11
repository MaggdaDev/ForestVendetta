
class ClientProtagonist {

    /**
     * 
     * @param {Phaser.Scene} scene 
     */
    constructor(scene) {
        this.mainScene = scene;
        this.renderMode = 'hitbox';
    }

    generateSprite(x, y) {
        console.log("Generating protagonist sprite...");
        this.sprite = this.mainScene.add.sprite(x, y, 'woman');
        this.sprite.displayWidth = 100;
        this.sprite.displayHeight = 100;
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