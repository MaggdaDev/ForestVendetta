class MobileEventEmitter extends Phaser.Events.EventEmitter{

    static instance;
    constructor() {
        super();
    }

    static getInstance() {
        if(!MobileEventEmitter.instance) {
            MobileEventEmitter.instance = new MobileEventEmitter();
        }
        return MobileEventEmitter.instance;
    }
}