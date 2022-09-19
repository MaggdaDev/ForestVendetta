class Loader {
    constructor(scene) {
        this.scene = scene;
    }

    loadAll() {
        this.loadConfig();
        this.loadSpriteSheets();
        this.loadImages();
        this.loadHtml();
        this.loadCss();
    }

    loadConfig() {
        // single weapons
        this.scene.load.json('RUSTY_SPADE_CONFIG', "GameplayConfig/Items/Weapons/SWORD/HEAVY_SWORD/RUSTY_SPADE.json");


        // general
        this.scene.load.json('ITEM_RARITY_CONFIG', "GameplayConfig/Items/itemRarity.json");
    }

    loadSpriteSheets() {
        this.scene.load.spritesheet('hotzenplotz', "GameClient/images/hotzenplotz.png", { frameWidth: 50, frameHeight: 50 });
        this.scene.load.spritesheet('hotzenplotzUpper', "GameClient/images/hotzenplotzUpper.png", { frameWidth: 50, frameHeight: 50 });
        this.scene.load.spritesheet('hotzenplotzLegs', "GameClient/images/hotzenplotzLegs.png", { frameWidth: 50, frameHeight: 50 });
        this.scene.load.spritesheet('frog', "GameClient/images/mobs/frog.png", { frameWidth: 151, frameHeight: 202 });
    }

    loadImages() {
        this.scene.load.image('rustySpade', "GameClient/images/weapons/rustySpade.png");
    }

    loadHtml() {
        this.scene.load.html('itemHoverInfo', 'GameClient/html/itemHoverInfo.html');
    }

    loadCss() {
        this.scene.load.css('ingameUiStyle', 'GameClient/css/ingameUiStyle.css');
    }
}