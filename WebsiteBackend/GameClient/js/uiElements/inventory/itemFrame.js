class ItemFrame extends Phaser.GameObjects.Container {
    static SIZE = 40;
    static BORDER_WIDTH = 2;

    static HOVER_INFO_OFFSET = 10;
    /**
     * 
     * @param {Object} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {HotBar} hotBar 
     */
    constructor(scene, x, y) {
        super(scene, x, y);
        this.overlayScene = scene;


        this.frameRect = this.overlayScene.add.rectangle(0, 0, ItemFrame.SIZE, ItemFrame.SIZE);
        this.frameRect.setStrokeStyle(ItemFrame.BORDER_WIDTH, 0x000000);
        this.frameRect.originX = 0.5;
        this.frameRect.originY = 0.5;
        this.add(this.frameRect);

        // item
        this.item = null;

        // hovering

        this.hoverInfo = null;
        var instance = this;
        this.frameRect.setInteractive();
        this.frameRect.on("pointerover", () => instance.onPointerOver());
        this.frameRect.on("pointerout", () => instance.onPointerOut());
        this.frameRect.setInteractive();
    }

    onPointerOver() {
        this.overlayScene.inventoryHUD.notifyEnterFrame(this);
        if (this.hoverInfo) {
            this.hoverInfo.sprite.setVisible(true);
        }

        console.log("Pointer over item frame");
    }

    onPointerOut() {
        this.overlayScene.inventoryHUD.notifyExitFrame(this);
        if (this.hoverInfo) {
            this.hoverInfo.sprite.setVisible(false);
        }

        console.log("Pointer out of item frame");
    }

    onPointerMove(pointer, localX, localY) {
        if (this.hoverInfo) {
            const localPoint = this.getLocalPoint(pointer.worldX, pointer.worldY);
            this.hoverInfo.setPos(localPoint.x, localPoint.y - 20);
        }
    }

    /**
     * 
     * @param {Object} item
     * @param {Object} item.sprite 
     */
    setItem(item) {
        this.item = item;
        this.add(item.itemIcon);
        item.itemIcon.setVisible(true);

        if (!item) {
            if (this.hoverInfo) {
                this.remove(this.hoverInfo.sprite);
                this.hoverInfo = null;
            }
        } else {
            if (this.hoverInfo) {
                this.remove(this.hoverInfo.sprite);
            }
            this.hoverInfo = item.hoverInfo;
            this.add(this.hoverInfo.sprite);
        }
    }

    unselect() {
        if (this.item) {
            this.item.sprite.setVisible(false);
        }
    }

}