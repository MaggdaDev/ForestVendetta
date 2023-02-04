class ParticleManager {
    constructor(scene, overlayScene) {
        this.mainScene = scene;
        this.overlayScene = overlayScene;
        this.rarityConfig = this.overlayScene.cache.json.get("ITEM_RARITY_CONFIG");
        if(this.rarityConfig === null || this.rarityConfig === undefined) {
            throw new Error("Couldnt load rarity info");
        } 
    }

    /**
     * 
     * @param {string} playerID 
     * @param {string} weaponRarity 
     * @param {Object} originPos 
     * @param {ClientPlayer} targetPlayer 
     */
    emitDropParticle(playerID, weaponRarity, originPos, targetPlayer) {
        const part = new DropParticle(this.mainScene, weaponRarity, originPos, targetPlayer, this.rarityConfig);
        this.mainScene.add.existing(part);
    }

    damageParticle(pos, damage) {
        var part = new DamageParticle(this.mainScene, pos, damage, this.rarityConfig);
        this.mainScene.add.existing(part);
        this.mainScene.physics.add.existing(part);
        part.body.velocity.y = -400;
        part.body.velocity.x = Math.sign(Math.random() - 0.5) * 100;
        part.body.setGravityY(400);

    }


}



