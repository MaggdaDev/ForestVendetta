class ItemBrowser {
    static FLEX_DIV_ID = "inventoryFlexDiv";

    static FILENAME_HOVERINFO = "itemHoverInfo";

    constructor() {
        console.log("Item Browser constructed")
        this.data = null;       // set by http request from redirect in this.setDisplayableInventoryData
        this.images = null;     // set by http request from redirect in this.setImages
        this.htmlMap = null;    // set by http request from redirect in this.setHtml
        this.cssMap = null;     // set by http request from redirect in this.setCss
        this.itemConfigMap = null; // set by ---
        this.ingameUICSSapplied = false;
    }

    /**
     * @description set inventory data for display from server
     * @param {Object} displayableInventoryData 
     * @param {Object[]} displayableInventoryData.inventory i.e. {_id: 'I0T1672682812809R15880', ownerDiscordID: '995658223434604669', itemName: 'RUSTY_SPADE'}
     * @param {Object[]} displayableInventoryData.hotbar
     * @param {Object[]} displayableInventoryData.armorBar
     */
    setDisplayableInventoryData(displayableInventoryData) {
        console.log("Received displayable inventory data from server at item browser")
        this.data = displayableInventoryData;
        this.checkReadyForDisplay();
    }

    /**
     * 
     * @param {Map} images map: imageName without extensin => base64 png data    RUSTY_SPADE => 387z3hfiwuqbzfo8237gzbi,
     */
    setImages(images) {
        this.images = images;
        this.checkReadyForDisplay();
    }

    /**
     * 
     * @param {Map} htmlMap map: file name without .html => html file
     */
    setInventoryHTML(htmlMap) {
        this.htmlMap = htmlMap;
    }

    /**
     * 
     * @param {Map} cssMap map: file name without .css => css file
     */
    setIngameUICSS(cssMap) {
        this.cssMap = cssMap;
        this.checkReadyForDisplay();
    }

    setItemConfig(itemConfigMap) {
        this.itemConfigMap = itemConfigMap;

        this.itemRarityConfig = JSON.parse(itemConfigMap.get("itemRarity"));
        this.itemConfigMap.forEach((currVal, currKey) => {
            this.itemConfigMap.set(currKey, JSON.parse(currVal));
        });
        console.log("Parsed item config to json");
        this.checkReadyForDisplay();
    }

    applyUICSS() {
        this.cssMap.forEach((currCss, currKey) => {
            console.log("Adding " + currKey + "(.css) to page");
            const style = document.createElement('style');
            style.innerHTML = currCss;
            document.head.appendChild(style);
        });
        this.ingameUICSSapplied = true;
        this.checkReadyForDisplay();
    }

    checkReadyForDisplay() {
        if (this.images !== null && this.data !== null && this.cssMap !== null && this.htmlMap !== null && this.ingameUICSSapplied && this.itemConfigMap !== null) {
            this.constructInventory();
        } else {
            console.log("Cant create inventory yet...");
        }
    }

    constructInventory() {
        console.log("Can create inventory now");
        this.inventoryConstructor = new InventoryConstructor(this.images, this.data, this.itemConfigMap, this.htmlMap.get(ItemBrowser.FILENAME_HOVERINFO), this.itemRarityConfig);
        this.inventoryConstructor.renderItemFrames();
    }


}