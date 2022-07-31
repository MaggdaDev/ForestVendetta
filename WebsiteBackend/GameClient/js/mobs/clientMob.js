class ClientMob {
    constructor(id, scene) {
        this.id = id;
        this.mainScene = scene;
        
        //Init in subclass constructor:
        this.sprite = undefined;
    }

    get pos() {
        return {x: this.sprite.x, y: this.sprite.y};
    }

    set pos(p) {
        this.sprite.x = p.x;
        this.sprite.y = p.y;
    }

    update(data) {
        this.pos = data.pos;
    }

    static fromSpawnCommand(data, scene) {
        switch(data.type) {
            case "FROG":
                var frog = new ClientFrog(data.id, data.pos, data.width, data.height, scene);
                return frog;
            default:
                console.error("Unknown mob type to spawn: " + data.type);
                return null;
        }
    }
}