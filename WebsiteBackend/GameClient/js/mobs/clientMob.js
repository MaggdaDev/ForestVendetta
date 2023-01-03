class ClientMob {
    /**
     * 
     * @param {string} id 
     * @param {Scene} scene 
     * @param {HealthBar} healthBar 
     */
    constructor(id, scene, healthBar, pos) {
        this.id = id;
        this.mainScene = scene;
        
        this.clientPrediction = new ClientPrediction(pos);
        //Init in subclass constructor:
        this.sprite = undefined;
        this.healthBar = healthBar;
        this.currHP = this.healthBar.currentHealth;
        this.onServerUpdateList = [];
    }

    updatePredictionClient(delta) {
        this.pos = this.clientPrediction.getNextClientPos(delta);
        this.healthBar.update(this.pos.x, this.pos.y, this.currHP);
    }


    addOnServerUpdate(h) {
        this.onServerUpdateList.push(h);
    }

    destroy() {
        this.sprite.destroy();
        this.healthBar.destroy();
    }

    get pos() {
        return {x: this.sprite.x, y: this.sprite.y};
    }

    set pos(p) {
        this.sprite.x = p.x;
        this.sprite.y = p.y;
    }

    //server update
    update(data) {
        // update prediction server pos
        this.clientPrediction.updateServer(data);

        //this.pos = data.pos;

        this.currHP = data.fightingObject.hp;

        
        var instance = this;
        this.onServerUpdateList.forEach((curr)=>{
            curr(data, instance);
        });
    }

    static fromSpawnCommand(data, scene) {
        switch(data.type) {
            case "FROG":
                var frog = new ClientFrog(data.id, data.pos, data.width, data.height, scene, data.fightingObject.hp);
                return frog;
            default:
                console.error("Unknown mob type to spawn: " + data.type);
                return null;
        }
    }
}