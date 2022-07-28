
class ClientProtagonist extends ClientPlayer {

    constructor(scene, id) {
        super(scene, id, true);
        this.playerController = new PlayerController(this);
        
    }

    /**
     * 
     * @param {ClientProtagonist} instance 
     */
    onStartWalkRight(instance) {
        super.isWalkingRight = true;
        if (this.isContact) {
            instance.sprite.scaleX = Math.abs(instance.sprite.scaleX);
            instance.sprite.scakeY = Math.abs(instance.sprite.scaleY);
            instance.sprite.play('startWalk');
            instance.sprite.on('animationcomplete', () => {
                instance.sprite.play('walk');
            });
        }

    }

    /**
     * 
     * @param {ClientProtagonist} instance 
     */
    onStopWalkRight(instance) {
        super.isWalkingRight = false;
        instance.stopAnimation();
    }

    /**
     * 
     * @param {ClientProtagonist} instance 
     */
    onStartWalkLeft(instance) {
        super.isWalkingLeft = true;
        if (this.isContact) {
            instance.sprite.scaleX = -1 * Math.abs(instance.sprite.scaleX);
            instance.sprite.scakeY = -1 * Math.abs(instance.sprite.scaleY);

            instance.sprite.play('startWalk');
            instance.sprite.on('animationcomplete', () => {
                instance.sprite.play('walk');
            });
        }

    }

    /**
     * 
     * @param {ClientProtagonist} instance 
     */
    onStopWalkLeft(instance) {
        super.isWalkingLeft = false;
        instance.stopAnimation();
    }

    stopAnimation() {
        this.sprite.stop();
        this.sprite.setFrame(0);
    }
}