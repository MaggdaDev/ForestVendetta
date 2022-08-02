class PlayerSprite extends Phaser.GameObjects.Container {
    static PROT_DISPLAY_SIZE = 100;
    constructor(mainScene, x, y, w, h) {
        super(mainScene,x,y);
        this.targetScene = mainScene;
        this.mainScene = mainScene;
        this.legSprite = mainScene.add.sprite(0, 0, 'hotzenplotzLegs');
        this.upperSprite = mainScene.add.sprite(0, 0, 'hotzenplotzUpper');

        this.legSprite.displayWidth = PlayerSprite.PROT_DISPLAY_SIZE;
        this.legSprite.displayHeight = PlayerSprite.PROT_DISPLAY_SIZE;
        this.upperSprite.displayHeight =  PlayerSprite.PROT_DISPLAY_SIZE;
        this.upperSprite.displayWidth =  PlayerSprite.PROT_DISPLAY_SIZE;

        this.add(this.legSprite);
        this.add(this.upperSprite);

        this.createAnimations();


    }

    createAnimations() {
        const legWalk = {
            key: 'legWalk',
            frames: this.mainScene.anims.generateFrameNumbers('hotzenplotzLegs', { frames: [2, 3, 4, 5, 6, 7, 8, 9] }),
            frameRate: 8,
            repeat: -1
        };
        const startLegWalk = {
            key: 'startLegWalk',
            frames: this.mainScene.anims.generateFrameNumbers('hotzenplotzLegs', { frames: [0, 1] }),
            frameRate: 8,
            repeat: 0
        }
        this.mainScene.anims.create(legWalk);
        this.mainScene.anims.create(startLegWalk);

        const upperWalk = {
            key: 'upperWalk',
            frames: this.mainScene.anims.generateFrameNumbers('hotzenplotzUpper', { frames: [2, 3, 4, 5, 6, 7, 8, 9] }),
            frameRate: 8,
            repeat: -1
        };
        const startUpperWalk = {
            key: 'startUpperWalk',
            frames: this.mainScene.anims.generateFrameNumbers('hotzenplotzUpper', { frames: [0, 1] }),
            frameRate: 8,
            repeat: 0
        }
        this.mainScene.anims.create(upperWalk);
        this.mainScene.anims.create(startUpperWalk);

        const heavySwordStrike = {
            key: 'heavySwordStrike',
            frames: this.mainScene.anims.generateFrameNumbers('hotzenplotzUpper', { frames: [10,11,12,10] }),
            frameRate: 5,
            repeat: 0
        }
        this.mainScene.anims.create(heavySwordStrike);
    }

    playHeavySwordStrike() {
        this.upperSprite.play('heavySwordStrike');
    }

    playStartWalk() {
        this.legSprite.play('startLegWalk');
        this.legSprite.on('animationcomplete', () => {
            this.legSprite.play('legWalk');
        });

        this.upperSprite.play('startUpperWalk');
        this.upperSprite.on('animationcomplete', () => {
            this.upperSprite.play('upperWalk');
        });
    }

    stopWalk() {
        this.legSprite.stop();
        this.upperSprite.stop();
        this.legSprite.setFrame(0);
        this.upperSprite.setFrame(0);
    }


}