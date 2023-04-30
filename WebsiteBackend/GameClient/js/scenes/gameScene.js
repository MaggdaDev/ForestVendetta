class GameScene extends Phaser.Scene {
    constructor(data) {
        super({ key: 'GameScene', active: true });
    }
    preload() {
        this.overlayScene = this.scene.get('OverlayScene');
        // scaling

        this.mobManager = new ClientMobManager(this);
        this.networkManager = new NetworkManager(this, this.mobManager);
        this.keyManager = new KeyManager(this);
        this.mouseManager = new MouseManager(this);     // important preload: will be accessed in create of overlay scene
        
        this.players = new Map();
        this.clientProtagonist = new ClientProtagonist(this, this.networkManager.clientId);
        this.players.set(this.networkManager.clientId, this.clientProtagonist);

        

        
        this.load.setBaseURL('./');

        // load 
        const loader = new Loader(this);
        loader.loadAll();
    }

    // OVERRIDE
    update(time, delta) {           // CLIENTSIDE UPDATE LOOP
        this.players.forEach((currPlayer) => {
            currPlayer.clientSideUpdate(time, delta);
        });
        this.mobManager.updateClientAllMobs(delta);
        this.overlayScene.clientUpdate(delta);
    }

    create() {
        this.tasten = this.input.keyboard.createCursorKeys();
        var scene = this;
        this.input.topOnly = false;
        
        console.log("Sending register request add player...");
        this.networkManager.sendRequestAddPlayer();

        
    }

    onOverlaySceneLoaded() {
        console.log("Calling onOverlaySceneLoaded in main scene");
        this.particleManager = new ParticleManager(this, this.overlayScene);
    }

    onLoadingSceneLoaded() {
        console.log("Calling loadingScene loaded in main scene");
    }

    updateGrade(gradeData) {
        this.overlayScene.updateGrade(gradeData);
    }


    // Start: Executing incoming commands from network manager


    playerDeath(id, respawnTime) {
        this.overlayScene.initRespawn(respawnTime);
    }

    switchToLoadingScene() {
        this.networkManager.setIsIngame(false);
        this.scene.start("LoadingScene");
        this.scene.stop("OverlayScene");
        console.log("Switched to loading scene");
    }

    /**
     * 
     * @param {string} playerID 
     * @param {string} weaponRarity 
     */
    addItemDrop(playerID, weaponRarity, originPos) {
        const targetPlayer = this.players.get(playerID);
        this.particleManager.emitDropParticle(playerID, weaponRarity, originPos, targetPlayer);
    }

    /**
     * 
     * @param {Object} data
     * @param {number} data.pos.x
     * @param {number} data.pos.y 
     * @param {number} id
     */
    addPlayer(data) {
        const armorBarAdd = data.armorBar;
        if (data.id == this.networkManager.clientId) {
            this.clientProtagonist.setInventoryItems(data.inventory);
            this.clientProtagonist.generateSprite(data.pos.x, data.pos.y, data.fightingObject.hp, data.userName, armorBarAdd);
            console.log('Added local protagonist with server data.');
            this.cameras.main.startFollow(this.clientProtagonist.sprite);

        } else {
            var newPlayer = new ClientPlayer(this, data.id, false);
            newPlayer.setInventoryItems(data.inventory);
            newPlayer.generateSprite(data.pos.x, data.pos.y, data.fightingObject.hp, data.userName, armorBarAdd)
            this.players.set(data.id, newPlayer);
            console.log('Added new player with id: ' + data.id);
        }

    }

    setupWorld(data) {
        console.log('Setting up world...');

        this.world = new ClientWorld(data, this);

        console.log('World setup complete.')

    }

    setupMatch(gradedMatchDuration) {
        console.log('Setting up match...');
        this.overlayScene.setMatchConfig(gradedMatchDuration);
    }

    updatePlayers(data) {
        var instance = this;
        data.forEach((currData) => {
            instance.players.get(currData.id).update(currData);
        });
    }

    showOldPlayers(data) {
        const armorBarAdd = data.armorBar;
        console.log('Adding old players to the game with data: ' + JSON.stringify(data));
        var instance = this;
        data.forEach((currData) => {
            var newPlayer = new ClientPlayer(instance, currData.id, false);
            newPlayer.setInventoryItems(currData.inventory)
            newPlayer.generateSprite(currData.pos.x, currData.pos.y, currData.fightingObject.hp, currData.userName, armorBarAdd);
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

    // error handling
    connectionIsUnauthorized(error) {
        super.visible = false;
        console.log("UNAUTHORIZED-HIDE ALL");
    }

}