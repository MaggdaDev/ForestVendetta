class InventoryHUD {

    constructor(overlayScene) {
        this.overlayScene = overlayScene;
        this.hotBar = new HotBar(overlayScene);
        this.overlayScene.add.existing(this.hotBar);
    }



    setItemToHotBarSlot(item, slot) {
        this.hotBar.setItemToSlot(item, slot);
    }
}