class ItemFrame {

    /**
     * 
     * @param {string} itemID generated via official shared ID gen
     * @param {string} type RUSTY_SPADE (as in image file name)
     * @param {string} imageBase64 image base 64 encoded
     */
    constructor(itemID, type, imageBase64) {
        this.itemID = itemID;
        this.type = type;
        this.imageBase64 = imageBase64;

        this.htmlElement = document.getElementById("itemFrameTemplate").content.cloneNode(true).querySelectorAll("div")[0];
        this.htmlElement.setAttribute("id", this.itemID);

        this.htmlImage = document.createElement("img");
        this.htmlImage.setAttribute("class", "itemFrameImg");
        this.htmlImage.setAttribute("src", "data:image/png;base64," + this.imageBase64);
        this.htmlElement.appendChild(this.htmlImage);

    }
}