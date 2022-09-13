class ItemFrame extends Phaser.GameObjects.Container {
    static SIZE = 40;
    static BORDER_WIDTH = 2;
    constructor(scene, x, y) {
        super(scene,x,y);
        this.mainScene = scene;
        
        this.frameRect = this.mainScene.add.rectangle(0, 0, ItemFrame.SIZE, ItemFrame.SIZE);
        this.frameRect.setStrokeStyle(ItemFrame.BORDER_WIDTH, 0x000000);
        this.add(this.frameRect);

        // item
        this.item = null;

        // hovering
        this.hoverInfo = new ItemHoverInfo(this.scene);
        this.add(this.hoverInfo.sprite);
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
    }

    select() {
        if(this.item) {
            this.item.sprite.setVisible(true);
        }
    }

    unselect() {
        if(this.item) {
            this.item.sprite.setVisible(false);
        }
    }

}