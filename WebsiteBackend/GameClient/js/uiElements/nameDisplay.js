/*class NameDisplay extends Phaser.GameObjects. Text{
    constructor(scene, displayName, rarity) {
        const pos = HealthBar.BAR_HEIGHT/2 + HealthBar.BORDER_WIDTH + HealthBar.DISPLAY_NAME_Y_OFFSET;
        super(scene, 0, -pos);
        this.mainScene = scene;

        this.setOrigin(0.5, 1);
        this.setColor(0xffffff);

        this.nameText = "";
        if(rarity !== undefined && rarity !== "" && rarity !== null) {
            const rarityConfig = this.mainScene.cache.json.get("ITEM_RARITY_CONFIG")[rarity];
            this.nameText += rarityConfig.display.name + " ";
            this.setColor(rarityConfig.display.color);
        }
        this.nameText += displayName;
        this.setText(this.nameText);
    }
}
*/

class NameDisplay extends Phaser.GameObjects.DOMElement{
    constructor(scene, displayName, rarity) {
        const pos = HealthBar.BAR_HEIGHT/2 + HealthBar.BORDER_WIDTH + HealthBar.DISPLAY_NAME_Y_OFFSET;
        super(scene);
        super.createFromCache('nameDisplay');
        super.x = 0;
        super.y = -pos;
        this.scaleX = -1;
        
        this.mainScene = scene;

        this.setOrigin(0.5, 1);
        this.raritySpan = this.getChildByID("raritySpan");
        this.nameSpan = this.getChildByID("nameSpan");
        this.nameSpan.innerHTML = displayName;
        
        if(rarity !== undefined && rarity !== "" && rarity !== null) {
            const rarityConfig = this.mainScene.cache.json.get("ITEM_RARITY_CONFIG")[rarity];
            const colorChange = rarityConfig.display.colorchange;
            var rarityStyle = "";
            if(colorChange) {
                if(this.color) {
                    rarityStyle += "color:" + this.color + ";";
                }
                rarityStyle += "-webkit-animation:" + colorChange + " 2s infinite alternate";
            } else {
                rarityStyle = 'color:' + rarityConfig.display.color;
            }
            this.raritySpan.innerHTML = rarityConfig.display.name + " ";
            this.raritySpan.style = rarityStyle;
        }       
        
    }
}