class ItemBrowser {
    static FLEX_DIV_ID = "inventoryFlexDiv";
    constructor() {
        console.log("Item Browser constructed")
        this.data = null;       // set by http request from redirect in this.setDisplayableInventoryData
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
        var flexDivContent = ""
        displayableInventoryData.inventory.forEach(element => {
            flexDivContent += `<div>${element.itemName}</div>\n`
        });
        document.getElementById(ItemBrowser.FLEX_DIV_ID).innerHTML = flexDivContent;
        // todo: load images from server on window load, display all
    }


}