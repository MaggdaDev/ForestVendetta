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
        this.inventory = new ClientInventory(scene, isProtagonist);
        this.clientPrediction = new ClientPrediction({x:0, y:0});
        this.stats = new Stats();

        this.onServerUpdate = [];
    }

    /**
     * @description called by main loop at client, predicts new position and responsible for moving the object
     * @param {*} time 
     * @param {*} delta 
     */
    clientSideUpdate(time, delta) {
        const pred = this.clientPrediction.getNextClientPos(delta);
        if (pred !== null && this.sprite !== undefined && this.sprite !== null) {
            this.sprite.updatePredicted(pred.x, pred.y);
            //console.log("setto");
        }
    }


    /**
     * @description general update method. Completely overridden by protagonist!
     * @param {*} data 
     */
    update(data) {
        for(var onUpdate of this.onServerUpdate) {
            onUpdate(data);
        }
        this.updateWeapon(data);
        this.updateSpriteToData(data);
        this.updateDebugPolygon(data);
        this.updateWalkingAnimation(data);
        this.isContact = data.isContact;
        this.stats.overrideFrom(data.stats);
        //console.log('Updated position: ' + JSON.stringify(data.hitBox.pos));
    }

    updateWeapon(data) {
        if (this.inventory.selected != data.inventory.selected) {
            this.equipItem(data.inventory.selected);
        }
    }

    equipItem(index) {
        this.inventory.selectedIndex = index;
        this.sprite.setWeapon(this.inventory.selectedItem);
        console.log("Equip idx " + index);
    }

    /**
     * @description used by prot and others to update sprite position, health, username, etc
     * @param {*} data 
     */
    updateSpriteToData(data) {
        //if (Math.random() < 0.1) {
            this.clientPrediction.updateServer(data);
            this.sprite.updateServer(data.fightingObject.hp, data.facingLeft, data.isAlive, data.isDisabled);
            this.inventory.setDisabled(data.isDisabled);
        //}
    }

    updateDebugPolygon(data) {
        if (this.sprite.weapon && this.sprite.weapon.debugPolygon.visible) {
            this.sprite.weapon.recreateDebugPolygon(0, 0, data.equippedWeapon.hitBox.points);
        }
    }

    /**
     * @description may be overridden! Is overridden by clientProtagonis
     * @param {*} data 
     */
    updateWalkingAnimation(data) {
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

    setInventoryItems(data) {
        this.inventory.generateItems(data);
    }

    getPos() {
        return new Vector(this.sprite.x, this.sprite.y);
    }

    updateInventoryItems(data) {
        this.inventory.updateItems(data);
    }

    generateSprite(x, y, maxHp, userName, armorBar) {
        console.log("Generating protagonist sprite...");
        this.sprite = new PlayerSprite(this.mainScene, x, y, maxHp, userName, this.id, armorBar);

        // weapon
        this.mainScene.add.existing(this.sprite);
    }

    remove() {
        this.sprite.deconstruct(); // 
    }

    strikeAnimationFromServer(data) {
        this.sprite.playHeavySwordStrike();
    }

    addEmoteParticle(particle) {
        this.sprite.add(particle);
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