class GameConfigLoader {
    constructor(scene) {
        this.scene = scene;
    }

    loadWeapons() {
        // single weapons
        this.scene.load.json('RUSTY_SPADE_CONFIG', 'GameplayConfig/Items/Weapons/SWORD/HEAVY_SWORD/RUSTY_SPADE.json');


        // general
        this.scene.load.json('ITEM_RARITY_CONFIG', 'GameplayConfig/Items/itemRarity.json');
    }
}