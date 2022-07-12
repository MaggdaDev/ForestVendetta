
class ClientProtagonist extends ClientPlayer {

    constructor(scene,id) {
        super(scene, id, true);
        this.playerController = new PlayerController(this);
    }

    
}