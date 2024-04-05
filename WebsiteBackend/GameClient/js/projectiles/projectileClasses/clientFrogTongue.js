class ClientFrogTongue extends ClientProjectile {
    static TONGUE_PIXEL_HEIGHT = 50;
    static TONGUE_PIXEL_WIDTH = 1000;
    static SCALE_FACT = 2;
    static FRAME_AMOUNT = 9;

    constructor(mainScene) {
        super();
        this.mainScene = mainScene;
        //this.polygon = this.mainScene.add.polygon(0, 0, [0, 0, 0, 0], 0xFF33ff);
        this.sprite = mainScene.add.sprite(0,0, "frogTongue");
        this.sprite.displayWidth = ClientFrogTongue.TONGUE_PIXEL_WIDTH * ClientFrogTongue.SCALE_FACT;
        this.sprite.displayHeight = ClientFrogTongue.TONGUE_PIXEL_HEIGHT * ClientFrogTongue.SCALE_FACT;
        this.sprite.setOrigin(0,0);
    }

    updateServer(projectileData) {
        //this.polygon.destroy();
        if(projectileData.shouldRender) {
            this.sprite.visible = true;
            //this.polygon = this.mainScene.add.polygon(0, 0, projectileData.points, 0xFF33ff);
            //console.log("Projectile points: " + projectileData.points);
            //this.polygon.displayOriginX = 0.5;
            //this.polygon.displayOriginY = 0.5;
            var startX = (projectileData.points[0].x + projectileData.points[1].x) / 2.0;
            var startY = (projectileData.points[0].y + projectileData.points[1].y) / 2.0;

            var endX = (projectileData.points[2].x + projectileData.points[3].x) / 2.0;
            var endY = (projectileData.points[2].y + projectileData.points[3].y) / 2.0;
            this.sprite.setRotation(Math.atan2(endY - startY, endX - startX));
            var tongueLength = Math.pow(Math.pow(projectileData.points[2].x - projectileData.points[1].x, 2.0) + Math.pow(projectileData.points[2].y - projectileData.points[1].y, 2.0), 0.5);
            this.sprite.setOrigin(1.0 - tongueLength / (ClientFrogTongue.SCALE_FACT * ClientFrogTongue.TONGUE_PIXEL_WIDTH), 0.5);
            this.sprite.setCrop(ClientFrogTongue.TONGUE_PIXEL_WIDTH - tongueLength / ClientFrogTongue.SCALE_FACT ,0, tongueLength, ClientFrogTongue.TONGUE_PIXEL_HEIGHT);
            this.sprite.x = startX;
            this.sprite.y = startY;
            
            var addForFlipY = 0;
            if(endX < startX) {
                addForFlipY = ClientFrogTongue.FRAME_AMOUNT;
            }
            this.sprite.setFrame(addForFlipY + Math.floor( + ClientFrogTongue.FRAME_AMOUNT  * (1.0 - tongueLength / (ClientFrogTongue.TONGUE_PIXEL_WIDTH* ClientFrogTongue.SCALE_FACT))));
        } else if(this.sprite.visible) {
            this.sprite.visible = false;
        }
        
    }

    destroy() {
        throw "implement me";
    }
}