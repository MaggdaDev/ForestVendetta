class ItemFrame {

    /**
     * 
     * @param {string} itemID generated via official shared ID gen
     * @param {string} type RUSTY_SPADE (as in image file name)
     * @param {string} imageBase64 image base 64 encoded
     */
    constructor(itemID, type, imageBase64, configObject, hoverInfoHtml, rarityConfig) {
        this.itemID = itemID;
        this.type = type;
        this.imageBase64 = imageBase64;
        this.configObject = configObject;
        this.hoverInfoHtml = hoverInfoHtml;

        this.hoverInfo = new ItemHoverInfo(hoverInfoHtml, configObject, rarityConfig[configObject.rarity]);
        hoverInfos.push(this.hoverInfo); // global object

        this.htmlElement = document.getElementById("itemFrameTemplate").content.cloneNode(true).querySelectorAll("div")[0];
        this.htmlElement.setAttribute("id", this.itemID);

        this.htmlImage = document.createElement("img");
        this.htmlImage.setAttribute("class", "itemFrameImg");
        this.htmlImage.setAttribute("src", "data:image/png;base64," + this.imageBase64);
        this.htmlElement.appendChild(this.htmlImage);

        this.htmlElement.onmouseenter = () => this.hoverInfo.show();
        this.htmlElement.onmouseleave = () => this.hoverInfo.hide();

    }
}