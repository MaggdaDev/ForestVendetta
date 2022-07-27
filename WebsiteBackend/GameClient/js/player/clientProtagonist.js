
class ClientProtagonist extends ClientPlayer {

    constructor(scene,id) {
        super(scene, id, true);
        this.playerController = new PlayerController(this);
    }

    /**
     * 
     * @param {ClientProtagonist} instance 
     */
    onStartWalkRight(instance) {
        instance.sprite.scaleX = Math.abs(instance.sprite.scaleX);
        instance.sprite.scakeY = Math.abs(instance.sprite.scaleY);
        instance.sprite.play('walk');
        console.log(this);

    }

    /**
     * 
     * @param {ClientProtagonist} instance 
     */
    onStopWalkRight(instance) {
        instance.sprite.stop();
        instance.sprite.setFrame(0);
    }

    /**
     * 
     * @param {ClientProtagonist} instance 
     */
    onStartWalkLeft(instance) {
        instance.sprite.scaleX = -1 * Math.abs(instance.sprite.scaleX);
        instance.sprite.scakeY = -1 * Math.abs(instance.sprite.scaleY);
        
        instance.sprite.play('walk');
    }

    /**
     * 
     * @param {ClientProtagonist} instance 
     */
    onStopWalkLeft(instance) {
        instance.sprite.stop();
        instance.sprite.setFrame(0);
    }
}