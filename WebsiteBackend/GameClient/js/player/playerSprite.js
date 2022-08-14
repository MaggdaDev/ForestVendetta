class PlayerSprite extends Phaser.GameObjects.Container {
    static PROT_DISPLAY_SIZE = 100;
    static HEALTH_BAR_Y_OFFSET = -65;
    constructor(mainScene, x, y, maxHp) {
        super(mainScene, x, y);
        this.targetScene = mainScene;
        this.mainScene = mainScene;
        this.legSprite = mainScene.add.sprite(0, 0, 'hotzenplotzLegs');
        this.upperSprite = mainScene.add.sprite(0, 0, 'hotzenplotzUpper');

        this.legSprite.displayWidth = PlayerSprite.PROT_DISPLAY_SIZE;
        this.legSprite.displayHeight = PlayerSprite.PROT_DISPLAY_SIZE;
        this.upperSprite.displayHeight = PlayerSprite.PROT_DISPLAY_SIZE;
        this.upperSprite.displayWidth = PlayerSprite.PROT_DISPLAY_SIZE;

        this.legSprite.on('animationcomplete', () => this.onUpperAnimationFinished());

        this.startingWalk = false;

        this.add(this.legSprite);
        this.add(this.upperSprite);

        this.createAnimations();

        this.upperSprite.on('animationupdate', (anim, frame) => this.onUpperAnimationUpdate(anim, frame));

        // hp bar
        this.healthBar = new HealthBar(mainScene, maxHp, x, y, PlayerSprite.HEALTH_BAR_Y_OFFSET, "PLAYER");
  
    }

    update(x, y, currHp) {
        this.x = x;
        this.y = y;
        this.healthBar.update(x, y, currHp);
    }

    onUpperAnimationUpdate(anim, frame) {
        this.weapon.update(frame.index);
    }

    setWeapon(weapon) { // weapon null for none equipped
        this.weapon = weapon;
        if (weapon !== null) {
            this.add(weapon.sprite);
            this.mainScene.add.existing(weapon.cooldownIndicator);
            this.add(weapon.cooldownIndicator);
            //this.add(weapon.debugPolygon);
        }
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
            frames: this.mainScene.anims.generateFrameNumbers('hotzenplotzUpper', { frames: [10, 11, 12, 10] }),
            frameRate: 5,
            repeat: 0
        }
        this.mainScene.anims.create(heavySwordStrike);
    }

    onUpperAnimationFinished() {
        if(this.weapon === null && this.startingWalk) {
            this.upperSprite.play('upperWalk');
            this.startingWalk = false;
        } else if (this.weapon.isStriking) {
            this.weapon.isStriking = false;
        }
    }

    playHeavySwordStrike() {
        this.upperSprite.play('heavySwordStrike');
        this.weapon.startStrike();
    }

    playStartWalk() {
        this.startingWalk = true;
        this.legSprite.play('startLegWalk');
        this.legSprite.on('animationcomplete', () => {
            this.legSprite.play('legWalk');
        });

        if (this.weapon === null) {
            this.upperSprite.play('startUpperWalk');
        }
    }

    stopWalk() {
        this.legSprite.stop();

        this.legSprite.setFrame(0);

        if (this.weapon === null && (this.upperSprite.anims.getCurrentKey() === 'upperWalk' || this.upperSprite.anims.getCurrentKey() === 'startUpperWalk')) {
            this.upperSprite.setFrame(0);
            this.upperSprite.stop();
        }
    }


}