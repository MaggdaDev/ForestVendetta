class InventoryHUD {

    constructor(overlayScene) {
        this.overlayScene = overlayScene;
        this.hotBar = new HotBar(overlayScene);
        this.overlayScene.add.existing(this.hotBar);
    
        // hovering
        this.hoveredFrame = null;
        const instance = this;
        this.overlayScene.input.on("pointermove", (pointer) => instance.onMouseMoved(pointer));
    }

    onMouseMoved(pointer) {
        if(this.hoveredFrame !== null) {
            this.hoveredFrame.onPointerMove(pointer);
        }
    }

    notifyExitFrame(frame) {
        if(this.hoveredFrame === frame) {
            this.hoveredFrame = null;
        }
    }

    notifyEnterFrame(frame) {
        this.hoveredFrame = frame;
        this.hoveredFrame.onPointerMove(this.overlayScene.input.activePointer);
    }




    setItemToHotBarSlot(item, slot) {
        this.hotBar.setItemToSlot(item, slot);
    }
}