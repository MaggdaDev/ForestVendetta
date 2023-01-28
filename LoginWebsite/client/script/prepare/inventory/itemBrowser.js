class ItemBrowser {
    static FLEX_DIV_ID = "inventoryFlexDiv";
    constructor() {
        console.log("Item Browser constructed")
        this.data = null;       // set by http request from redirect in this.setDisplayableInventoryData
        this.images = null;     // set by http request from redirect in this.setImages
    }

    /**
     * @description set inventory data for display from server
     * @param {Object} displayableInventoryData 
     * @param {Object[]} displayableInventoryData.inventory i.e. {_id: 'I0T1672682812809R15880', ownerDiscordID: '995658223434604669', itemName: 'RUSTY_SPADE'}
     * @param {Object[]} displayableInventoryData.hotbar
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

    checkReadyForDisplay() {
        if(this.images !== null && this.data !== null) {
            this.constructInventory();
        } else {
            console.log("Cant create inventory yet...");
        }
    }

    constructInventory() {
        console.log("Can create inventory now");
        this.inventoryConstructor = new InventoryConstructor(this.images, this.data);
        this.inventoryConstructor.renderItemFrames();
    }


}