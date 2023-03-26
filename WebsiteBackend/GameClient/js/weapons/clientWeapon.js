class ClientWeapon {
    constructor(scene, imageName, data) {
        this.mainScene = scene;
        this.imageName = imageName;
        this.sprite = this.mainScene.add.image(0, 0, imageName, 'Phaser 3 pixelArt: true');
        this.debugPolygon = this.mainScene.add.polygon(0, 0, data.hitBox.points, 0xFF33ff);
        this.debugPolygon.displayOriginX = 0.5;
        this.debugPolygon.displayOriginY = 0.5;
        this.sprite.displayHeight = 64;
        this.sprite.displayWidth = 64;
        this.sprite.setVisible(false);

        this.isStriking = false;

        this.debugPolygon.setVisible(false);



        // cooldown
        this.onCooldown = false;

        this.visible = false;

        this.cooldownIndicator = new WeaponCooldownIndicator(scene);

        this.createItemIcon();
        this.update(0);

        this.staticConfig = this.mainScene.cache.json.get(data.typeData.name + "_CONFIG");  // auto name guessing: loading i.e. "RUSTY_SPADE_CONFIG" from cache (see game config loader)
        if(this.staticConfig === undefined || this.staticConfig === null) {
            throw new Error("Unknown item config file. Please load config file");
        }
        try {
            this.rarityInfo = this.mainScene.cache.json.get("ITEM_RARITY_CONFIG")[this.staticConfig.rarity];        // for displaying the rarity
            if (this.rarityInfo === undefined || this.rarityInfo === null) throw ("rarity info is null/undefined for weapon " + data.name);
        } catch (error) {
            console.error(error);
        }

        //hover info
        this.hoverInfo = new ItemHoverInfo(scene.overlayScene, this.staticConfig, this.rarityInfo)


    }

    createItemIcon() {
        this.itemIcon = this.mainScene.add.image(0, 0, this.imageName);
        this.itemIcon.displayHeight = ItemFrame.SIZE;
        this.itemIcon.displayWidth = ItemFrame.SIZE;
        this.itemIcon.setVisible(false);
    }

    /**
     * 
     * @param {number} time - time in s
     */
    cooldown(time) {
        console.log("Cooldown started!");
        this.onCooldown = true;
        this.cooldownIndicator.startCooldown(time);
    }

    checkCooldown() {       // returns: true=ready false=onCooldown
        if (this.onCooldown) {
            if (this.cooldownIndicator.checkCooldown()) {
                this.onCooldown = false;
                return true;
            } else {
                return false;
            }
        }
        return true;
    }

    recreateDebugPolygon(x, y, points) {
        if (this.debugPolygon.visible) {
            this.debugPolygon.destroy();
            this.debugPolygon = this.mainScene.add.polygon(x, y, points, 0xFF33ff);
            this.debugPolygon.displayOriginX = 0.5;
            this.debugPolygon.displayOriginY = 0.5;
            this.debugPolygon.setVisible(true);
        }
    }

    static fromData(scene, data) {
        switch (data.typeData.name) {
            case "RUSTY_SPADE":
                return new ClientRustySpade(scene, data);
            case "OBSIDIAN_PINE_NEEDLE":
                return new ClientObsidianPineNeedle(scene, data);
            case "SLIMY_SPADE":
                return new ClientSlimySpade(scene, data);
            default:
                console.error("UNSUPPORTED WEAPON TYPE: " + data.typeData.name);
                break;
        }
    }

    startStrike() {
        this.isStriking = true;
        this.visible = true;
    }

    update(frame) {
        var data = this.displayData(frame);
        this.sprite.x = data.pos.x;
        this.sprite.y = data.pos.y;
        this.sprite.angle = data.rot;
    }


    displayData(frame) {
        if (this.isStriking) {
            return this.strikingDisplayData(frame);
        } else {
            return this.strikingDisplayData(0);
        }
    }

    strikingDisplayData(frame) {
        console.error("PLEASE OVERRIDE STRIKING DISPLAY DATA!");
    }


    set visible(v) {
        this.sprite.setVisible(v);
        //this.debugPolygon.setVisible(v);
    }

    set playerPos(pos) {
        this.weaponPos = this.playerToWeaponPos(pos);
    }

    playerToWeaponPos(pos) {
        return pos;
    }

    set weaponPos(pos) {
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
    }
}