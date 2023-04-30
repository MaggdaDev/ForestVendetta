class ArmorOverlay extends Phaser.GameObjects.Container {
    static POSITIONS = {
        BOOTS: { x: 0, y: 0 }
    }
    constructor(gameScene, armorBarData) {
        super(gameScene);
        this.gameScene = gameScene;
        this.existentPieces = new Map();
        // boots
        const bootsData = armorBarData.boots;
        if (bootsData !== undefined && bootsData !== null) {
            this.boots = this.createSpriteFromName(
                ArmorOverlay.POSITIONS.BOOTS.x, 
                ArmorOverlay.POSITIONS.BOOTS.y,
                bootsData.typeData.name,
                "BOOTS");
            this.add(this.boots);
            this.existentPieces.set("BOOTS", this.boots);
        }


    }

    playStartWalkAnimations() {
        this.existentPieces.forEach((currPiece, currType) => {
            currPiece.play(ArmorOverlay.getStartLegWalkKeyFromType(currType));
            currPiece.playAfterRepeat(ArmorOverlay.getLegWalkKeyFromType(currType));
        });
    }

    playWalkAnimations() {
        this.existentPieces.forEach((currPiece, currType) => {
            currPiece.stop();
            currPiece.play(ArmorOverlay.getLegWalkKeyFromType(currType));
        });
    }

    stopAnimations() {
        this.existentPieces.forEach((currPiece, currType) => {
            currPiece.playAfterRepeat(null);
            currPiece.stop();
            currPiece.setFrame(0);
        });
    }

    createSpriteFromName(x, y, name, type) {
        const spriteName =  name + "_SPRITE";
        const retSprite = this.gameScene.add.sprite(x, y, spriteName);
        retSprite.displayWidth = PlayerSprite.PROT_DISPLAY_SIZE;
        retSprite.displayHeight = PlayerSprite.PROT_DISPLAY_SIZE;
        const legWalk = {
            key: ArmorOverlay.getLegWalkKeyFromType(type),
            frames: this.gameScene.anims.generateFrameNumbers(spriteName, { frames: [2, 3, 4, 5, 6, 7] }),
            frameRate: 8,
            repeat: -1
        };
        const startLegWalk = {
            key: ArmorOverlay.getStartLegWalkKeyFromType(type),
            frames: this.gameScene.anims.generateFrameNumbers(spriteName, { frames: [0, 1] }),
            frameRate: 8,
            repeat: 0
        }
        
        this.gameScene.anims.create(legWalk);
        this.gameScene.anims.create(startLegWalk);


        return retSprite;
    }

    static getStartLegWalkKeyFromType(type) {
        return 'startLegWalk_' + type;
    }

    static getLegWalkKeyFromType(type) {
        return 'legWalk_' + type;
    }
}