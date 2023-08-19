class EmoteSelector extends Phaser.GameObjects.Container {
    constructor(overlayScene) {
        super(overlayScene, 200, 200);
        this.overlayScene = overlayScene;
        //this.setVisible(false);

        this.showing = false;
        this.lastCenterX = 0;
        this.lastCenterY = 0;
        this.options = [];
        this.currentSelectedIdx = 0;
        this.loadedEmoteIDs = [];
        this.hide();
    }

    createOptions(emoteObjectList) {
        for(var i = 0; i < this.totalElements; i += 1) {
            const option = new EmoteOption(this.overlayScene, this.totalElements, i, 0, 0, emoteObjectList[i].id);
            this.options.push(option);
            this.add(option.getArc());
            this.add(option.getSprite());
        }
    }

    loadProtagonistEmotes(emoteObjectList) {
        this.totalElements = emoteObjectList.length;
        this.overlayScene.load.once(Phaser.Loader.Events.COMPLETE, () => {
            console.log("Loading emotes complete, creating selector.");  
            this.createOptions(emoteObjectList);
        });
        this.loadPlayerEmotes(emoteObjectList);
    }

    loadPlayerEmotes(emoteObjectList) {
        var loadedCounter = 0;
        var notLoadedCounter = 0;
        for(var currEmoteObject of emoteObjectList) {
            const id = currEmoteObject.id;
            if(id === undefined || id == null) throw "Received emote with non existent id";
            if(this.loadedEmoteIDs.includes(id)) {
                notLoadedCounter += 1;
            } else {
                this.loadedEmoteIDs.push(id);
                this.overlayScene.load.image(EmoteSelector._spriteIdFromEmoteId(id), 
                    EmoteSelector._createEmoteURI(id));
                loadedCounter += 1;
            }
        }
        console.log("Started load of " + loadedCounter + " new emotes and skipped " + notLoadedCounter + " emotes.");
        this.overlayScene.load.start();
    }

    showAt(x,y) {
        this.x = x;
        this.y = y;
        this.setVisible(true);
        this.lastCenterX = x;
        this.lastCenterY = y;
        

    }

    hide() {
        this.setVisible(false);
    }

    emotePressed(event) {
        if(!this.showing && this.totalElements > 0) {
            this.showing = true;
            const activePointer = this.overlayScene.input.activePointer;
            this.showAt(activePointer.x, activePointer.y);
            this.currentSelectedIdx = -1;
            this.mouseMoved(activePointer);
        }
    }

    emoteReleased(event) {
        this.showing = false;
        const currIdx = this.calcCurrSelectedIdx(this.overlayScene.input.activePointer.x, this.overlayScene.input.activePointer.y);
        const selectedEmoteID = this.options[currIdx].emoteID;
        console.log("Selected emote: " + selectedEmoteID);
        this.hide();
        this.overlayScene.gameScene.networkManager.sendShowEmoteCommand(selectedEmoteID);

    }

    mouseMoved(event) {
        if(this.showing && this.totalElements > 0) {
            const idx = this.calcCurrSelectedIdx(event.x, event.y);
            if(this.currentSelectedIdx !== idx) {
                this.currentSelectedIdx = idx;
                this.hover(idx);
            }
        }
    }

    hover(idx) {
        for(var i = 0; i < this.totalElements; i+=1) {
            if(i === idx) {
                this.options[i].hover();
            } else {
                this.options[i].unhover();
            }
        }
        this.sort("depth");
        
    }

    calcCurrSelectedIdx(mouseX, mouseY) {
        if(this.totalElements === 1) return 0;
        const dX = mouseX - this.lastCenterX;
        const dY = mouseY - this.lastCenterY;
        var angle = Math.atan2(dY, dX);
        if(angle < 0) angle += 2 * Math.PI;
        return Math.round((angle/ (2*Math.PI)) * this.totalElements - 0.5) % this.totalElements;
    }

    static _spriteIdFromEmoteId(emoteID) {
        return "EMOTE_" + emoteID;
    }

    static _createEmoteURI(emoteID) {
        return "https://cdn.discordapp.com/emojis/" + emoteID + ".png?size=32";
    }

        
}