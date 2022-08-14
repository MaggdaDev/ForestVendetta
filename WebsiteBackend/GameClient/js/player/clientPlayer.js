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
        this.sprite.update(data.pos.x, data.pos.y, data.fightingObject.hp);

        if (this.sprite.weapon.debugPolygon.visible) {
            this.sprite.weapon.recreateDebugPolygon(0, 0, data.equippedWeapon.hitBox.points);
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



    generateSprite(x, y, w, h, weapon, maxHp) {
        console.log("Generating protagonist sprite...");
        this.sprite = new PlayerSprite(this.mainScene, x, y, w, h, maxHp);

        // weapon
        this.weapon = ClientWeapon.fromData(this.mainScene, weapon);
        this.sprite.setWeapon(this.weapon);
        this.mainScene.add.existing(this.sprite);


    }
}