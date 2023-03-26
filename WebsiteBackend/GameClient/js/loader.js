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
        
        this.scene.load.json('SLIMY_SPADE_CONFIG', "GameplayConfig/Items/Weapons/SWORD/HEAVY_SWORD/SLIMY_SPADE.json");
        this.scene.load.json('OBSIDIAN_PINE_NEEDLE_CONFIG', "GameplayConfig/Items/Weapons/SWORD/HEAVY_SWORD/OBSIDIAN_PINE_NEEDLE.json");


        // general
    }

    loadSpriteSheets() {
        this.scene.load.spritesheet('hotzenplotz', "GameClient/images/hotzenplotz.png", { frameWidth: 50, frameHeight: 50 });
        this.scene.load.spritesheet('hotzenplotzUpper', "GameClient/images/hotzenplotzUpper.png", { frameWidth: 50, frameHeight: 50 });
        this.scene.load.spritesheet('hotzenplotzLegs', "GameClient/images/hotzenplotzLegs.png", { frameWidth: 50, frameHeight: 50 });
        this.scene.load.spritesheet('frog', "GameClient/images/mobs/frog.png", { frameWidth: 151, frameHeight: 202 });
    }

    loadImages() {
        // weapons
        this.scene.load.image('rustySpade', "GameClient/images/weapons/RUSTY_SPADE.png");
        this.scene.load.image('slimySpade', "GameClient/images/weapons/SLIMY_SPADE.png");
        this.scene.load.image('obsidianPineNeedle', "GameClient/images/weapons/OBSIDIAN_PINE_NEEDLE.png");

        // armor
        this.scene.load.image('obsidianPineNeedle', "GameClient/images/armor/FROG_BOOTS.png");

        // animations
        this.scene.load.image("dropIcon", "GameClient/images/animations/dropIcon.png");
        this.scene.load.image("dropShade", "GameClient/images/animations/dropShade.png");
        this.scene.load.image("dropParticles", "GameClient/images/animations/dropParticles.png");

        
    }

    loadHtml() {
        this.scene.load.html('nameDisplay', 'GameClient/html/nameDisplay.html');
    }

    loadCss() {
        
    }  

    loadOverlayStuff() {
        this.scene.load.image('mobileWalkstick', "GameClient/images/walkstick.png");
        this.scene.load.image('mobileJumpButton', "GameClient/images/jumpbutton.png");
        this.scene.load.image('mobileStrikeButton', "GameClient/images/strikebutton.png");

        this.scene.load.html('gameButton', 'GameClient/html/gameButton.html');

        this.scene.load.css('ingameUiStyle', 'GameClient/css/ingameUiStyle.css');
        this.scene.load.html('itemHoverInfo', 'GameClient/html/inventory/itemHoverInfo.html');
        this.scene.load.json('ITEM_RARITY_CONFIG', "GameplayConfig/Items/itemRarity.json");
    }
}