class GameScene extends Phaser.Scene {
    constructor(data) {
        super(data);
    }
    preload() {
        // scaling

        this.mobManager = new ClientMobManager(this);
        this.networkManager = new NetworkManager(this, this.mobManager);
        this.keyManager = new KeyManager(this);
        this.mouseManager = new MouseManager(this);
        this.particleManager = new ParticleManager(this);
        this.players = new Map();
        this.clientProtagonist = new ClientProtagonist(this, this.networkManager.clientId);
        this.players.set(this.networkManager.clientId, this.clientProtagonist);

        console.log("Sending register request add player...");
        this.networkManager.sendRequestAddPlayer();

        this.load.setBaseURL('GameClient');

        // load ressources
        this.load.spritesheet('hotzenplotz', 'images/hotzenplotz.png', { frameWidth: 50, frameHeight: 50 });
        this.load.spritesheet('hotzenplotzUpper', 'images/hotzenplotzUpper.png', { frameWidth: 50, frameHeight: 50 });
        this.load.spritesheet('hotzenplotzLegs', 'images/hotzenplotzLegs.png', { frameWidth: 50, frameHeight: 50 });
        this.load.spritesheet('frog', 'images/mobs/frog.png', { frameWidth: 151, frameHeight: 202 });


        this.load.image('rustySpade', 'images/weapons/rustySpade.png');



    }

    create() {
        this.tasten = this.input.keyboard.createCursorKeys();
        var scene = this;
        this.physicsInfo = new PhysicsControlInfo(this);


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
        if (data.id == this.networkManager.clientId) {
            this.clientProtagonist.generateSprite(data.pos.x, data.pos.y, data.width, data.height, data.equippedWeapon, data.fightingObject.hp);
            console.log('Added local protagonist with server data.');
        } else {
            var newPlayer = new ClientPlayer(this, data.id, false);
            newPlayer.generateSprite(data.pos.x, data.pos.y, data.width, data.height, data.equippedWeapon, data.fightingObject.hp)
            this.players.set(data.id, newPlayer);
            console.log('Added new player with id: ' + data.id);
        }

    }

    setupWorld(data) {
        console.log('Setting up world...');

        this.world = new ClientWorld(data, this);

        console.log('World setup complete.')

    }

    updatePlayers(data) {
        var instance = this;
        data.forEach((currData) => {
            instance.players.get(currData.id).update(currData);
        });
    }

    showOldPlayers(data) {
        console.log('Adding old players to the game with data: ' + JSON.stringify(data));
        var instance = this;
        data.forEach((currData) => {
            var newPlayer = new ClientPlayer(instance, currData.id, false);
            newPlayer.generateSprite(currData.pos.x, currData.pos.y, currData.width, currData.height, currData.equippedWeapon, currData.fightingObject.hp);
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

    strikeAnimation(data) {
        if (data.id === this.clientProtagonist.id) {
            this.clientProtagonist.cooldown(data);
        } else {
            this.players.get(data.id).strikeAnimationFromServer(data);
        }
    }

    damageAnimation(data) {
        this.particleManager.damageParticle(data.pos, data.damage);
    }

    removeGameObjects(data) {
        data.forEach((curr) => {
            switch (curr.type) {
                case "MOB":
                    this.mobManager.removeMob(curr);
                    break;
                default:
                    console.log("Unknown remove type: " + type);
                    break;
            }
        });
    }

    // End: Executing incoming commands from network manager

}