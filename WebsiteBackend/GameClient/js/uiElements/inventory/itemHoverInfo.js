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
        const itemStatsHtml = new ItemStatsHtml(staticItemConfig.stats);
        const itemRarityHtml = new ItemRarityHtml(rarityConfig, staticItemConfig.display.class_name);

        this.sprite.getChildByID("nameLbl").setHTML(itemNameHtml.toHtml());
        this.sprite.getChildByID("descriptionLbl").setHTML(itemDescriptionHtml.toHtml());
        this.sprite.getChildByID("statsLbl").setHTML(itemStatsHtml.toHtml());
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

class ItemStatsHtml {
    constructor(statsConfig) {
        this.statsConfig = statsConfig;
    }

    toHtml() {
        return "Dmg +" + this.statsConfig.damage;
    }
}

class ItemRarityHtml {
    constructor(rarityConfig, className) {
        this.rarityConfig = rarityConfig;
        this.color = this.rarityConfig.display.color;
        this.colorchange = this.rarityConfig.display.colorchange;
        this.name = this.rarityConfig.display.name;
        this.className = className;

        if(this.colorchange) {
            this.colorChangeCss = "";
            if(this.color) {
                this.colorChangeCss += "color:" + this.color + ";";
            }
            this.colorChangeCss += "-webkit-animation:" + this.colorchange + " 2s infinite alternate";
            this.html = '<span style="' + this.colorChangeCss + '">' + this.name + " " + this.className + ' </span>';
        } else {
            this.html = '<span style="color:' + this.color + ';">' + this.name + " " + this.className + " </span>";
        }
    }

    toHtml() {
        return this.html;
    }
}