class EmoteOption {
    static RADIUS = 100;
    static EMOTE_RADIUS = 50;
    static STROKE_WIDTH_DEFAULT = 1;
    static STROKE_COLOR_DEFAULT = 0x000000;
    static STROKE_WIDTH_SELECTED = 4;
    static STROKE_COLOR_SELECTED = 0x808080;
    constructor(overlayScene, totAmount, currIdx, centerX, centerY, emoteID) {
        this.emoteID = emoteID;
        this.overlayScene = overlayScene;
        const startAngle = (currIdx/totAmount) * 360;
        const endAngle = 360 * (currIdx+1)/totAmount
        this.arc = this.overlayScene.add.arc(centerX, centerY, EmoteOption.RADIUS, startAngle, endAngle, false);
        this.unhover();
        const midAngleRads = Math.PI * (endAngle + startAngle) / 360;   // factor 2 cancels!
        var imgRad = EmoteOption.EMOTE_RADIUS;
        if(totAmount === 1) imgRad = 0;
        this.sprite = this.overlayScene.add.sprite(imgRad * Math.cos(midAngleRads),
        imgRad * Math.sin(midAngleRads),
        EmoteSelector._spriteIdFromEmoteId(emoteID));
    }

    getArc() {
        return this.arc;
    }

    getSprite() {
        return this.sprite;
    }

    hover() {
        this.arc.setDepth(1);
        this.arc.setStrokeStyle(EmoteOption.STROKE_WIDTH_SELECTED, EmoteOption.STROKE_COLOR_SELECTED);
    }

    unhover() {
        this.arc.setDepth(0);
        this.arc.setStrokeStyle(EmoteOption.STROKE_WIDTH_DEFAULT, EmoteOption.STROKE_COLOR_DEFAULT);
    }

    
}