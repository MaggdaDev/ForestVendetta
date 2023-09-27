class ClientFrogTongue extends ClientProjectile {

    constructor(mainScene) {
        super();
        this.mainScene = mainScene;
        this.polygon = this.mainScene.add.polygon(0, 0, [0, 0, 0, 0], 0xFF33ff);
    }

    updateServer(projectileData) {
        this.polygon.destroy();
        if(projectileData.shouldRender) {
            this.polygon = this.mainScene.add.polygon(0, 0, projectileData.points, 0xFF33ff);
            this.polygon.displayOriginX = 0.5;
            this.polygon.displayOriginY = 0.5;
        }
        
    }

    destroy() {
        throw "implement me";
    }
}