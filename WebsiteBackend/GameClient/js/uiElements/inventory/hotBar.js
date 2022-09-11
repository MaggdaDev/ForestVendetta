class HotBar {
    static FRAME_AMOUNT = 9;
    static FRAME_SPACING = 3;
    constructor(scene, x, y) {
        this.overlayScene = scene;
        this.sprite = this.overlayScene.add.container(x,y);
        this.frames = [];
        this.setupFrames();
        Phaser.Display.Align.In.BottomCenter(this.sprite, this.overlayScene.screenZone, 0, - 2*ItemFrame.SIZE);

        //selection rect
        this.selectionRect = this.overlayScene.add.rectangle(this.calcXOfNthFrame(0),0,ItemFrame.SIZE+2*ItemFrame.BORDER_WIDTH, ItemFrame.SIZE+2*ItemFrame.BORDER_WIDTH);
        this.selectionRect.setStrokeStyle(ItemFrame.BORDER_WIDTH+2, 0x808080);
        this.sprite.add(this.selectionRect);
    }

    setupFrames() {
        var addFrame;
        for(var i = 0; i < HotBar.FRAME_AMOUNT; i+=1) {
            addFrame = new ItemFrame(this.overlayScene,this.calcXOfNthFrame(i), 0);
            this.frames.push(addFrame);
            this.sprite.add(addFrame);
        }
    }

    calcXOfNthFrame(n) {
        return (n-HotBar.FRAME_AMOUNT/2) * (HotBar.FRAME_SPACING + (ItemFrame.BORDER_WIDTH * 2) + ItemFrame.SIZE);
    }
}