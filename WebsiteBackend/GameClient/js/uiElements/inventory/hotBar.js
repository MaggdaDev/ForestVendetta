class HotBar {
    static FRAME_AMOUNT = 6;
    static FRAME_SPACING = 3;
    constructor(scene) {
        this.overlayScene = scene;
        this.sprite = this.overlayScene.add.container();
        this.frames = [];
        this.setupFrames();
        Phaser.Display.Align.In.BottomCenter(this.sprite, this.overlayScene.screenZone, 0, - 2 * ItemFrame.SIZE);

        //selection rect
        this.selectionRect = this.overlayScene.add.rectangle(this.calcXOfNthFrame(0), 0, ItemFrame.SIZE + 2 * ItemFrame.BORDER_WIDTH, ItemFrame.SIZE + 2 * ItemFrame.BORDER_WIDTH);
        this.selectionRect.setStrokeStyle(ItemFrame.BORDER_WIDTH + 2, 0x808080);
        this.sprite.add(this.selectionRect);
        this.currSelectionPos = 0;
        this.currSelectedIdx = 0;
        this.currSelectedFrame = this.frames[0];
        // scrolling
        var instance = this;
        this.overlayScene.gameScene.mouseManager.mouseScroll = function (pointer, gameObject, dx, dy, dz) {
            instance.onMouseScroll(dy);
        };
    }

    setItemToSlot(item, slot) {
        this.frames[slot].setItem(item);
    }

    onMouseScroll(dy) {
        this.currSelectionPos += dy / 100;
        while (this.currSelectionPos < 0) {
            this.currSelectionPos += HotBar.FRAME_AMOUNT;
        }
        while (this.currSelectionPos > HotBar.FRAME_AMOUNT - 1) {
            this.currSelectionPos -= HotBar.FRAME_AMOUNT;
        }
        this.currSelectedIdx = Math.floor(this.currSelectionPos);
        this.selectFrame(this.currSelectedIdx);

        // network
        this.sendSelectFrameMessage();
    }

    sendSelectFrameMessage() {
        this.overlayScene.gameScene.networkManager.sendSelectItemCommand(this.currSelectedIdx);
    }

    selectFrame(idx) {
        this.currSelectedIdx = idx;
        this.selectionRect.x = this.calcXOfNthFrame(this.currSelectedIdx);
        this.currSelectedFrame = this.frames[this.currSelectedIdx];
        this.currSelectedFrame.select();
        this.frames.forEach((currFrame) => {
            if (currFrame !== this.currSelectedFrame) {
                currFrame.unselect();
            }
        });
    }

    setupFrames() {
        var addFrame;
        for (var i = 0; i < HotBar.FRAME_AMOUNT; i += 1) {
            addFrame = new ItemFrame(this.overlayScene, this.calcXOfNthFrame(i), 0);
            this.frames.push(addFrame);
            this.sprite.add(addFrame);
        }
    }

    calcXOfNthFrame(n) {
        return (n - HotBar.FRAME_AMOUNT / 2) * (HotBar.FRAME_SPACING + (ItemFrame.BORDER_WIDTH * 2) + ItemFrame.SIZE);
    }
}