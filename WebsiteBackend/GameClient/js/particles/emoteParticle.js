class EmoteParticle extends Phaser.GameObjects.Sprite {
    static LIFE_SPAN = 1700;
    static Y_START_OFFSET = 10;
    
    constructor(mainScene, emoteID, x, y) {
        super(mainScene, x, y, EmoteSelector._spriteIdFromEmoteId(emoteID));
        this.lifeSpanRemaining = EmoteParticle.LIFE_SPAN;
        this.startY = y + EmoteParticle.Y_START_OFFSET;
    }

    preUpdate(time, delta) {
        this.lifeSpanRemaining -= delta;
        const percOver = 1 - this.lifeSpanRemaining/EmoteParticle.LIFE_SPAN;
        const yBlend = 1 - 4 * percOver / (3 * percOver + 1);
        const alphaBlend = Math.pow(percOver, 6.0);
        this.y = this.startY + yBlend * EmoteParticle.Y_START_OFFSET;
        this.setAlpha(1 - 1.5*alphaBlend);
        if (this.lifeSpanRemaining < 0) {
            this.destroy();
        }
    }

}