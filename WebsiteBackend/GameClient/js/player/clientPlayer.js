class ClientPlayer {

    /**
     * 
     * @param {Phaser.Scene} scene 
     */
    constructor(scene, id, isProtagonist) {
        this.mainScene = scene;
        this.id = id;
        this.isProtagonist = isProtagonist;
        this.isContact = false;
        this.isWalkingRight = false;
        this.isWalkingLeft = false;
    }


    update(data) {
        this.updateSpriteToData(data);
        this.updateDebugPolygon(data);
        this.updateWalkingAnimationToData(data);
        this.isContact = data.isContact;
        //console.log('Updated position: ' + JSON.stringify(data.hitBox.pos));
    }

    updateSpriteToData(data) {
        this.sprite.update(data.pos.x, data.pos.y, data.fightingObject.hp, data.facingLeft);
    }

    updateDebugPolygon(data) {
        if (this.sprite.weapon.debugPolygon.visible) {
            this.sprite.weapon.recreateDebugPolygon(0, 0, data.equippedWeapon.hitBox.points);
        }
    }

    updateWalkingAnimationToData(data) {
        if (data.isWalking) {
            if (data.facingLeft && (!this.isWalkingLeft)) {  // start walk left needed
                this.onStartWalkLeft();
            } else if ((!data.facingLeft) && (!this.isWalkingRight)) {   // start walk right needed
                this.onStartWalkRight();
            }
        } else {
            if (this.isWalkingLeft || this.isWalkingRight) {
                this.stopAnimation();
            }
        }
    }

    generateSprite(x, y, w, h, weapon, maxHp) {
        console.log("Generating protagonist sprite...");
        this.sprite = new PlayerSprite(this.mainScene, x, y, w, h, maxHp);

        // weapon
        this.weapon = ClientWeapon.fromData(this.mainScene, weapon);
        this.sprite.setWeapon(this.weapon);
        this.mainScene.add.existing(this.sprite);
    }

    remove() {
        this.sprite.destroy(true);
    }

    strikeAnimationFromServer(data) {
        this.sprite.playHeavySwordStrike();
    }

    //walking animation start

    /**
     * 
     * @param {ClientPlayer} instance 
     */
    onStartWalkRight() {
        this.isWalkingLeft = false;
        this.isWalkingRight = true;
        this.sprite.flipped = false;
        this.sprite.playStartWalk();
    }

    /**
     * 
     * @param {ClientPlayer} instance 
     */
    onStopWalkRight() {
        this.isWalkingRight = false;
        this.stopAnimation();
    }

    /**
     * 
     * @param {ClientPlayer} instance 
     */
    onStartWalkLeft() {
        this.isWalkingRight = false;
        this.isWalkingLeft = true;
        this.sprite.flipped = true;
        this.sprite.playStartWalk();

    }

    /**
     * 
     * @param {ClientPlayer} instance 
     */
    onStopWalkLeft() {
        this.isWalkingLeft = false;
        this.stopAnimation();
    }

    stopAnimation() {
        this.isWalkingLeft = false;
        this.isWalkingRight = false;
        this.sprite.stopWalk();
    }

    // walking animation end
}