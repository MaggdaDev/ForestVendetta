class ClientInventory {
    constructor(gameScene, isProtagonists) {
        this.hotBarItems = Array(9);
        this.selected = null;
        this.gameScene = gameScene;

        this.isProtagonists = isProtagonists;
    }

    /**
     * 
     * @param {Object} data
     * @param {Object[]} data.hotBar
     * @param {number} data.selected 
     */
    generateItems(data) {
        for(var i = 0; i < data.hotBar.length; i += 1) {
            this.setNewItemToSlot(data.hotBar[i], i);
        }
        this.selected = -1;
    }

    updateItems(data) {
        for(var i = 0; i < data.hotBar.length; i += 1) {
            if(!this.hotBarItems[i]) {
                this.setNewItemToSlot(data.hotBar[i], i);
            } else if(this.hotBarItems[i].id !== data.hotBar[i].id) {
                throw "Not supported yet: Overriding client item with new one";
            }
        }
    }

    setNewItemToSlot(itemData, i) {
        if(itemData === null || itemData === undefined) {
            this.hotBarItems[i] = null;
            return;
        }
        this.hotBarItems[i] = ClientWeapon.fromData(this.gameScene, itemData);

        if(this.isProtagonists) {
            this.gameScene.overlayScene.inventoryHUD.setItemToHotBarSlot(this.hotBarItems[i], i);
        }
    }

    get selectedItem() {
        return this.hotBarItems[this.selected];
    }
}