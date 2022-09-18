class ItemHoverInfo {

    /**
     * 
     * @param {Scene} overlayScene 
     * @param {Object} staticItemConfig 
     * @param {Object} rarityConfig 
     */
    constructor(overlayScene, staticItemConfig, rarityConfig) {
        this.overlayScene = overlayScene;

        this.sprite = this.overlayScene.add.dom(0,0).createFromCache('itemHoverInfo');

        const itemNameHtml = new ItemNameHtml(staticItemConfig.display.name);
        const itemDescriptionHtml = new ItemDescriptionHtml(staticItemConfig.display.description);
        const itemRarityHtml = new ItemRarityHtml(rarityConfig);

        this.sprite.getChildByID("nameLbl").setHTML(itemNameHtml.toHtml());
        this.sprite.getChildByID("descriptionLbl").setHTML(itemDescriptionHtml.toHtml());
        this.sprite.getChildByID("rarityLbl").setHTML(itemRarityHtml.toHtml());
        this.sprite.originX = 0.5;
        this.sprite.originY = 1;
        this.sprite.setVisible(false);

        const instance = this;
    }

    setPos(x,y) {
        this.sprite.x = x;
        this.sprite.y = y;
    }
}

class ItemNameHtml {
    constructor(name) {
        this.name = name;
    }

    toHtml() {
        return this.name;
    }
}

class ItemDescriptionHtml {
    constructor(description) {
        this.description = description;
    }

    toHtml() {
        return this.description;
    }
}

class ItemRarityHtml {
    constructor(rarityConfig) {
        this.rarityConfig = rarityConfig;
        this.color = this.rarityConfig.display.color;
        this.name = this.rarityConfig.display.name;
    }

    toHtml() {
        return '<span style="color:' + this.color + ';">' + this.name + "</p";
    }
}