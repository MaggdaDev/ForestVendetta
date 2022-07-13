class GameScene extends Phaser.Scene {
    constructor(data) {
        super(data);
    }
    preload() {
        this.networkManager = new NetworkManager(this);
        this.keyManager = new KeyManager(this);
        this.players = new Map();
        this.clientProtagonist = new ClientProtagonist(this, this.networkManager.clientId);
        this.players.set(this.networkManager.clientId, this.clientProtagonist);

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


    // Start: Executing incoming commands from network manager

    /**
     * 
     * @param {Object} data
     * @param {number} data.pos.x
     * @param {number} data.pos.y 
     * @param {number} id
     */
    addPlayer(data) {
        if(data.id == this.networkManager.clientId) {
            this.clientProtagonist.generateSprite(data.hitBox.pos.x, data.hitBox.pos.y, data.hitBox.width, data.hitBox.height);
            console.log('Added local protagonist with server data.');
        } else {
            var newPlayer = new ClientPlayer(this, data.id, false);
            newPlayer.generateSprite(data.hitBox.pos.x, data.hitBox.pos.y, data.hitBox.width, data.hitBox.height)
            this.players.set(data.id, newPlayer);
            console.log('Added new player with id: '+ data.id);
        }

    }

    setupWorld(data) {
        console.log('Setting up world...');

        this.world = new ClientWorld(data, this);

        console.log('World setup complete.')
    }

    updatePlayers(data) {
        var instance = this;
        data.forEach((currData)=>{
            instance.players.get(currData.id).update(currData);
        });
    }

    showOldPlayers(data) {
        console.log('Adding old players to the game with data: ' + JSON.stringify(data));
        var instance = this;
        data.forEach((currData)=>{
            var newPlayer = new ClientPlayer(instance, currData.id, false);
            newPlayer.generateSprite(currData.hitBox.pos.x, currData.hitBox.pos.y, currData.hitBox.width, currData.hitBox.height);
            instance.players.set(currData.id, newPlayer);
        });
        console.log('Added ' + data.length + ' old players to the game.');
    }

    disconnectPlayer(id) {
        console.log("Disconnecting player: " + id + " ...");
        var toRemove = this.players.get(id);
        toRemove.remove();
        this.players.delete(id);
        console.log("Player disconnected!");
    }

    updateWorld(data) {
        this.world.update(data);
    }

    // End: Executing incoming commands from network manager

}