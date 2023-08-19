class EmoteOption {
    static ARC_COLOR = 0xFF0000;
    static ARC_COLOR_HOVERED = 0x00FF00;
    static RADIUS = 100;
    static EMOTE_RADIUS = 50;
    constructor(overlayScene, totAmount, currIdx, centerX, centerY, emoteID) {
        this.emoteID = emoteID;
        this.overlayScene = overlayScene;
        const startAngle = (currIdx/totAmount) * 360;
        const endAngle = 360 * (currIdx+1)/totAmount
        this.arc = this.overlayScene.add.arc(centerX, centerY, EmoteOption.RADIUS, startAngle, endAngle, false, EmoteOption.ARC_COLOR);
        
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
        this.arc.fillColor = EmoteOption.ARC_COLOR_HOVERED;
    }

    unhover() {
        this.arc.fillColor = EmoteOption.ARC_COLOR;
    }

    
}