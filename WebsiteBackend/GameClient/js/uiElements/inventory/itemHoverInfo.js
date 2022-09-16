class ItemHoverInfo {
    constructor(overlayScene) {
        this.overlayScene = overlayScene;

        this.sprite = this.overlayScene.add.dom(0,0).createFromCache('itemHoverInfo');
        this.sprite.getChildByID("rarityLbl").setHTML("SUPER RARE ITEM");
        this.sprite.originX = 0.5;
        this.sprite.originY = 1;
        this.sprite.setVisible(false);

        const instance = this;
        this.sprite.setInteractive();
        this.sprite.addListener('click', (pointer, localX, localY)=> instance.onPointerMoved(pointer, localX, localY));
    }

    onPointerMoved(pointer, localX, localY) {
        this.setPos(localX, localY + 200);
    }

    setPos(x,y) {
        this.sprite.x = x;
        this.sprite.y = y;
    }
}