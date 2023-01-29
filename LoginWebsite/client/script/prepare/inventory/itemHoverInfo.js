class ItemHoverInfo {
    /*
item config:
{
    "display": {
        "name": "Rusty Spade",
        "class_name": "Heavy Sword", 
        "description": "It's just the rusty spade from the back of your barn..."
    },
    "stats": {
        "damage": 50,
        "cooldown": 0.8
    },
    "rarity": "COMMON"
}
    */
    constructor(hoverInfoHTML, itemConfig, thisRarityConfig) {
        this.htmlElement = document.createElement("div");
        
        this.htmlElement.innerHTML = hoverInfoHTML;
        this.htmlElement.style.position = "absolute";
        this.htmlElement.querySelector("#nameLbl").innerHTML = itemConfig.display.name;
        this.htmlElement.querySelector("#descriptionLbl").innerHTML = itemConfig.display.description;
        this.htmlElement.querySelector("#statsLbl").innerHTML = "Dmg +" + itemConfig.stats.damage;

        
        this.htmlElement.querySelector("#rarityLbl").innerHTML = this.getRarityHtml(itemConfig, thisRarityConfig);


        this.htmlElement.hidden = true;

        
        document.body.appendChild(this.htmlElement);
        this.hidden = true;
    }

    updatePos(x,y) {
        if(!this.hidden) {
            const yMoved = y + 20;
        this.htmlElement.style.left = x + "px";
        this.htmlElement.style.top = yMoved + "px";
        }
    }

    hide() {
        this.hidden = true;
        this.htmlElement.hidden = true;
    }

    show() {
        this.hidden = false;
        this.htmlElement.hidden = false;
    }

    getRarityHtml(itemConfig, thisRarityConfig) {
        const rarityColor = thisRarityConfig.display.color;
        const colorchange = thisRarityConfig.display.colorchange;
        const rarityName = thisRarityConfig.display.name;
        const className = itemConfig.display.class_name;
        var rarityHtml = "";
        if(colorchange) {
            const colorChangeCss = "";
            if(rarityColor) {
                colorChangeCss += "color:" + rarityColor + ";";
            }
            colorChangeCss += "-webkit-animation:" + colorchange + " 2s infinite alternate";
            rarityHtml += '<span style="' + colorChangeCss + '">' + rarityName + " " + className + ' </span>';
        } else {
            rarityHtml += '<span style="color:' + rarityColor + ';">' + rarityName + " " + className + " </span>";
        }

        return rarityHtml;
    }
}