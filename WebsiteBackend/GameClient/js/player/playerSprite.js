class PlayerSprite extends Phaser.GameObjects.Container {
    static PROT_DISPLAY_SIZE = 100;
    static HEALTH_BAR_Y_OFFSET = -65;
    constructor(mainScene, x, y, maxHp, userName) {
        super(mainScene, x, y);
        this.targetScene = mainScene;
        this.excludeFromFlip = [];
        this.facingLeft = false;
        this.mainScene = mainScene;
        this.legSprite = mainScene.add.sprite(0, 0, 'hotzenplotzLegs');
        this.upperSprite = mainScene.add.sprite(0, 0, 'hotzenplotzUpper');

        this.legSprite.displayWidth = PlayerSprite.PROT_DISPLAY_SIZE;
        this.legSprite.displayHeight = PlayerSprite.PROT_DISPLAY_SIZE;
        this.upperSprite.displayHeight = PlayerSprite.PROT_DISPLAY_SIZE;
        this.upperSprite.displayWidth = PlayerSprite.PROT_DISPLAY_SIZE;

        this.upperSprite.on('animationcomplete', () => this.onUpperAnimationFinished());

        this.startingWalk = false;
        this.strikePlaying = false;

        this.add(this.legSprite);
        this.add(this.upperSprite);

        this.createAnimations();

        this.upperSprite.on('animationupdate', (anim, frame) => this.onUpperAnimationUpdate(anim, frame));

        // hp bar
        this.healthBar = new HealthBar(mainScene, maxHp, x, y, PlayerSprite.HEALTH_BAR_Y_OFFSET, "PLAYER", userName);

    }

    deconstruct() {
        this.healthBar.destroy(true);
        this.destroy(true);
    }

    updatePredicted(x, y) {
        this.x = x;
        this.y = y;
        this.healthBar.update(this.x, this.y, this.healthBar.currentHealth);
    }

    updateServer(currHp, facingLeft, isAlive) {
        this.healthBar.update(this.x, this.y, currHp);
        if (facingLeft !== undefined) {
            this.flipped = facingLeft;
        }
        this.setVisible(isAlive);
    }

    onUpperAnimationUpdate(anim, frame) {
        if (this.weapon) {
            this.weapon.update(frame.index);
        }
    }

    setWeapon(weapon) { // weapon null for none equipped
        if (this.weapon && (!weapon)) {  // from equipped to unequipped
            this.upperSprite.stop();
            this.upperSprite.setFrame(0);
            this.weapon.update(0);
        }
        this.weapon = weapon;
        if (weapon === null || weapon === undefined) {   // no weapon


        } else {                                        // weapon equipped
            this.weapon.sprite.setVisible(true);                    // weapon visible
            this.upperSprite.stop();                                // stop swinging arms while walking
            this.upperSprite.setFrame(10);                          // weapon holding pose
            this.add(weapon.sprite);
            this.mainScene.add.existing(weapon.cooldownIndicator);
            this.excludeFromFlip.push(weapon.cooldownIndicator);
            this.add(weapon.cooldownIndicator);
            //this.add(weapon.debugPolygon);
        }
    }



    onUpperAnimationFinished() {
        if (this.weapon === null && this.startingWalk) {
            this.upperSprite.play('upperWalk');
            this.startingWalk = false;
        } else if (this.weapon && this.weapon.isStriking) {
            this.weapon.isStriking = false;
        }
    }

    playHeavySwordStrike() {
        if (!this.strikePlaying) {
            this.strikePlaying = true;
            this.upperSprite.play('heavySwordStrike');
            var instance = this;
            this.upperSprite.on('animationcomplete', () => instance.onStrikeFinished());
            this.upperSprite.on('animationstop', () => instance.onStrikeFinished());
            this.weapon.startStrike();
        }
    }

    onStrikeFinished() {
        this.strikePlaying = false;
    }

    playStartWalk() {
        this.startingWalk = true;
        this.legSprite.play('startLegWalk');
        this.legSprite.playAfterRepeat('legWalk');
        this.legSprite.on('animationrepeat', () => {
            if (this.weapon === null) {
                this.upperSprite.play('upperWalk');
            }
        });

        if (this.weapon === null) {
            this.upperSprite.play('startUpperWalk');
        }
    }

    stopWalk() {
        this.legSprite.playAfterRepeat(null);
        this.legSprite.stop();

        this.legSprite.setFrame(0);

        if (this.weapon === null) {
            this.upperSprite.setFrame(0);
            this.upperSprite.stop();
        }
    }

    set flipped(f) {
        this.facingLeft = f;
        if (!f) {
            this.scaleX = Math.abs(this.scaleX);
            this.excludeFromFlip.forEach((curr) => {
                curr.scaleX = Math.abs(curr.scaleX);
            });

        } else {
            this.scaleX = -1 * Math.abs(this.scaleX);
            this.excludeFromFlip.forEach((curr) => {
                curr.scaleX = -1 * Math.abs(curr.scaleX);
            });
        }
    }

    setVisible(b) {
        super.setVisible(b);
        this.healthBar.setVisible(b);
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


}