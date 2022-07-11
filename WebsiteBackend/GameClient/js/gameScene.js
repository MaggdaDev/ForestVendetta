class GameScene extends Phaser.Scene {
    constructor(data) {
        super(data);
    }
    preload() {
        this.networkManager = new NetworkManager(this);
        this.clientProtagonist = new ClientProtagonist(this);

        console.log("Sending register request add player...");
        this.networkManager.sendRequestAddPlayer();

        this.load.setBaseURL('GameClient');

        // load ressources
        this.load.spritesheet('woman', 'images/woman.png', { frameWidth: 100, frameHeight: 100 });


    }

    create() {
        

        this.tasten = this.input.keyboard.createCursorKeys();

        

        var scene = this;

        /**
         * @param {Object} data
         * @param {number} data.x - new x pos
         * @param {number} data.y - new y pos
         */
        /*this.registry.socket.on('update', function (data) {
        //    console.log('update: ' + data);
            woman.x = data.x;
            woman.y = data.y;
        });
        this.registry.socket.on('updateEnv', function (data) {
            if (!scene.platform) {
                scene.platform = new ClientPlatform(data);
                console.log('Platform created!');
            }
            console.log('updateEnv: ' + JSON.stringify(data));
        });
        */


        
       


    }

    /**
     * 
     * @param {Object} data
     * @param {number} data.pos.x
     * @param {number} data.pos.y 
     * @param {number} id
     */
    addPlayer(data) {
        if(data.id == this.networkManager.clientId) {
            this.clientProtagonist.generateSprite(data.pos.x, data.pos.y);
        }
    }

}