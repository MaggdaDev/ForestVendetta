
class ClientProtagonist extends ClientPlayer {

    constructor(scene, id) {
        super(scene, id, true);
        this.playerController = new PlayerController(this, MobileController.isMobile(scene));
        this.gameScene = scene;

        this.onServerUpdate.push((data) => this.protagonistOnUpdate(data));
        
    }

    protagonistOnUpdate(data) {
        this.gameScene.updateGrade(data.gradeData);
        this.gameScene.updateStats(data.stats);
    }

    // Overrides from ClientPlayer and gets called there in update
    updateWalkingAnimation(data) {
        if (data.isContact && (!this.isContact)) {
            this.isContact = true;
            if (this.isWalkingLeft) {
                this.onStartWalkLeft(this);
            } else if (this.isWalkingRight) {
                this.onStartWalkRight(this);
            }
        } else if ((!data.isContact) && this.isContact) {
            this.isContact = false;
            this.stopAnimation();
        }
    }

    cooldown(data) {
        this.inventory.selectedItem.cooldown(data.cooldownTime);
    }

    strike(instance) {
        if (instance.inventory.selectedItem && instance.inventory.selectedItem.checkCooldown()) {
            instance.mainScene.networkManager.sendPlayerControl(PlayerControls.STRIKE);
            instance.sprite.playHeavySwordStrike();
        }
    }

    /** OVERRIDE 
     * 
     * @param {ClientPlayer} instance 
     */
     onStartWalkRight() {
        this.isWalkingLeft = false;
        this.isWalkingRight = true;
        if (this.isContact) {       // CHANGE TO SUPER: only with contact
            this.sprite.flipped = false;
            this.sprite.playStartWalk();
        }
    }

    /** OVERRIDE
     * 
     * @param {ClientPlayer} instance 
     */
    onStartWalkLeft() {
        this.isWalkingRight = false;
        this.isWalkingLeft = true;
        if (this.isContact) {   // CHANGE TO SUPER: only with contact
            this.sprite.flipped = true;
            this.sprite.playStartWalk();
        }

    }

    // probably useless TODO remove
    updateInventory(data) {
        this.updateInventoryItems(data.inventory);
    }

    /*
    updateSpriteToLocal(data) {
        this.sprite.update(data.pos.x, data.pos.y, data.fightingObject.hp, this.sprite.facingLeft);
    }
    */

    
}