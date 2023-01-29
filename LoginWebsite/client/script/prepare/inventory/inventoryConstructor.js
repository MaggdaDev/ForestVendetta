class InventoryConstructor {
    /**
     * 
     * @param {Map} images image file name => image base64 encoded
     * @param {Object} data 
     * @param {Object[]} data.hotbar
     * @param {Object[]} data.inventory [{itemName:"RUSTY_SPADE", ownerDiscordID:"995658223434604669", _id:"I0T1672322359836R7433"}]
     */
    constructor(images, data) {
        console.log("Creating inventory...");
        this.images = images;
        this.data = data;
        this.itemFrames = this._createItemFrames();

        const hotbarContent = [];
        data.hotbar.forEach((currItem)=> {
            hotbarContent.push(currItem._id);
        });
        hotbar.setCurrContent(hotbarContent);
    }

    _createItemFrames() {
        console.log("Creating item frames...");
        const ret = [];
        var currAdd = null;
        this.data.inventory.forEach((currItem, idx) => {
            currAdd = new ItemFrame(currItem._id, currItem.itemName, this.images.get(currItem.itemName));
            ret.push(currAdd);
        });
        return ret;

    }

    renderItemFrames() {
        const inventoryBox = document.getElementById("inventoryFlexDiv");
        this.itemFrames.forEach((currFrame)=> {
            inventoryBox.appendChild(currFrame.htmlElement);
        });
        console.log("Rendered item frames!");

        hotbar.takeContent();
    }
}