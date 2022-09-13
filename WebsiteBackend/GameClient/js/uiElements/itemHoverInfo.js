class ItemHoverInfo {
    constructor(overlayScene) {
        this.overlayScene = overlayScene;

        this.sprite = this.overlayScene.add.dom(0,0).createFromCache('itemHoverInfo');
        this.sprite.originX = 1;
        this.sprite.originY = 1;
    }

    setPos(x,y) {
        this.sprite.x = x;
        this.sprite.y = y;
    }
}