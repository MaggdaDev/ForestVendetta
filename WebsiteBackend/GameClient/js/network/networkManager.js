class NetworkManager {
    /**
     * 
     * @param {Phaser.Scene} scene 
     */
    constructor(scene, mobManager) {
        console.log("Creating Network manager...");
        this.isIngame = true;
        this.mainScene = scene;
        const authObj = this.extractUriParams();

        console.log("Creating socket...")
        this.socket = io("/g", { 
            auth: authObj,
            path:  "/g/socket.io",
            query: {
                "port": authObj.port
            }
        });
        this.socket.on('connect_error', (error) => {
            console.log("UNAUTHORIZED");
            scene.connectionIsUnauthorized(error);
        });

        this.clientId = authObj.userID;
        console.log("ClientId created: " + this.clientId);

        this.mobManager = mobManager;


        // Start: registering command handling
        this.registerIngameCommandHandling(NetworkCommands.ADD_PLAYER, (data) => this.addPlayer(data));
        this.registerIngameCommandHandling(NetworkCommands.SETUP_WORLD, (data) => this.setupWorld(data));
        this.registerIngameCommandHandling(NetworkCommands.SETUP_MATCH, (data) => this.setupMatch(data));
        this.registerIngameCommandHandling(NetworkCommands.UPDATE_PLAYERS, (data) => this.updatePlayers(data));
        this.registerIngameCommandHandling(NetworkCommands.SHOW_OLD_PLAYERS, (data) => this.showOldPlayers(data));
        this.registerIngameCommandHandling(NetworkCommands.SHOW_OLD_MOBS, (data) => this.showOldMobs(data));
        this.registerIngameCommandHandling(NetworkCommands.DISCONNECT_PLAYER, (data) => this.disconnectPlayer(data));
        this.registerIngameCommandHandling(NetworkCommands.UPDATE_WORLD, (data) => this.updateWorld(data));
        this.registerIngameCommandHandling(NetworkCommands.UPDATE, (data) => this.update(data));
        this.registerIngameCommandHandling(NetworkCommands.CONTROL_DATA, (data) => this.controlData(data));
        this.registerIngameCommandHandling(NetworkCommands.SPAWN_MOB, (data) => this.spawnMob(data));
        this.registerIngameCommandHandling(NetworkCommands.STRIKE_ANIMATION, (data) => this.strikeAnimation(data));
        this.registerIngameCommandHandling(NetworkCommands.DAMAGE_ANIMATION, (data) => this.damageAnimation(data));
        this.registerIngameCommandHandling(NetworkCommands.REMOVE_GAMEOBJECTS, (data) => this.removeGameObjects(data));
        this.registerIngameCommandHandling(NetworkCommands.ADD_ITEM_DROP, (data) => this.addItemDrop(data));

        this.socket.on(NetworkCommands.PLAYER_DEATH, (data) => this.playerDeath(data));
        this.socket.on(NetworkCommands.SHOW_SAVING_PROGRESS_SCREEN, (data) => this.showSavingProgressScreen(data));
        this.socket.on(NetworkCommands.REDIRECT_TO_HOME, (data) => this.redirectToHome(data));
        this.socket.on(NetworkCommands.SHOW_EMOTE, (data) => this.showEmote(data));

        // End: registering command handling

        console.log("NetworkManager created.")
    }


    setIsIngame(b) {
        this.isIngame = b;
    }

    registerIngameCommandHandling(command, handler) {
        this.socket.on(command, (data) => {
            if (this.isIngame) {
                handler(data);
            }
        });
    }

    extractUriParams() {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        const userID = params.userID;
        const pw = params.pw;
        const port = params.port;
        console.log("Extracted auth params from uri: userID:" + userID + " and pw: " + pw + " and port: " + port);
        return {
            userID: userID,
            pw: pw,
            port: port
        }
    }

    // Start: Handling commands

    playerDeath(data) {
        const id = data.id;
        const respawnTime = data.respawnTime;
        this.mainScene.playerDeath(id, respawnTime);
    }

    redirectToHome(data) {
        
        console.log("Redirecting to home... (" + data.url + ")");
        location.href = data.url;
    }

    showSavingProgressScreen(data) {
        console.log("Handling show saving progress screen command...");
        this.mainScene.switchToLoadingScene();
    }

    /**
     * 
     * @param {Object} data 
     * @param {string} data.id player id
     * @param {string} data.weaponRarity
     * @param {Object} data.originPos 
     */
    addItemDrop(data) {
        const playerID = data.id;
        const weaponRarity = data.weaponRarity;
        const originPos = data.originPos;
        this.mainScene.addItemDrop(playerID, weaponRarity, originPos);
    }

    /**
     * 
     * @param {Object} data
     * @param {number} data.pos.x
     * @param {number} data.pos.y 
     * @param {number} id
     */
    addPlayer(data) {
        console.log('Add player command received with data ' + JSON.stringify(data));
        this.mainScene.addPlayer(data);
    }

    /**
     * 
     * @param {Object} data
     * @param {string} data.gradedMatchDuration
     */
     setupMatch(data) {
        const gradedMatchDuration = data.graded_match_duration;
        this.mainScene.setupMatch(gradedMatchDuration);
    }

    /**
     * 
     * @param {Object} data
     * @param {WorldObject[]} data.worldObjects 
     */
    setupWorld(data) {
        this.mainScene.setupWorld(data);
    }

    /**
     * 
     * @param {Object} data - data object to add old players
     */
    showOldPlayers(data) {
        console.log("Show old players command received: " + JSON.stringify(data));
        this.mainScene.showOldPlayers(data);
    }

    /**
     * 
     * @param {Mob[]} data - all old mobs 
     */
    showOldMobs(data) {
        this.mobManager.showOldMobs(data);
    }

    /**
     * 
     * @param {number} id - unique player clientId 
     */
    disconnectPlayer(id) {
        this.mainScene.disconnectPlayer(id);
    }

    controlData(data) {
        //console.log(data);
        this.mainScene.overlayScene.physicsInfo.updateText(data);
    }


    /**
     * 
     * @param {Object} data
     * @param {number} data.id
     * @param {string} data.type 
     * @param {Object} data.pos
     */
    spawnMob(data) {
        this.mobManager.spawnMob(data);
    }


    /**
     * 
     * @param {Object[]} data - all update objects, [{update:'PLAYERS',data:}, {update:'WORLD', data:}]
     */
    update(data) {
        //console.log('Update: ' + JSON.stringify(data));
        this.mainScene.updateWorld(data.world);
        this.mainScene.updatePlayers(data.players);
        this.mobManager.updateMobs(data.mobs);
    }

    /**
     * 
     * @param {Object} data 
     * @param {string} data.id
     * @param {string} data.weaponId
     * @param {number} data.time
     */
    strikeAnimation(data) {
        this.mainScene.strikeAnimation(data);
    }

    /**
     * 
     * @param {Object} data
     * @param {string} data.weaponId
     * @param {number} data.damage
     * @param {Object} data.pos 
     */
    damageAnimation(data) {
        this.mainScene.damageAnimation(data);
    }

    /**
     * 
     * @param {*} data 
     */
    removeGameObjects(data) {
        this.mainScene.removeGameObjects(data);
    }

    /**
     * 
     * @param {Object} data 
     * @param {number} data.playerID
     * @param {number} data.emoteID
     */
    showEmote(data) {
        this.mainScene.showEmote(data);
    }

    // End: Handling commands


    // Start: Sending commands
    sendLeaveGameRequest() {
        this.sendCommand(NetworkCommands.REQUEST_LEAVE_GAME, { id: this.clientId });
    }

    sendRequestAddPlayer() {
        this.sendCommand(NetworkCommands.REQUEST_ADD_PLAYER, { id: this.clientId });
    }

    sendSelectItemCommand(idx) {
        this.sendCommand(NetworkCommands.REQUEST_SELECT_ITEM, { index: idx });
    }

    sendPlayerControl(control) {
        this.sendCommand(NetworkCommands.PLAYER_CONTROL, control);
    }

    sendShowEmoteCommand(emoteID) {
        this.sendCommand(NetworkCommands.REQUEST_SHOW_EMOTE, 
            {id: emoteID});
    }

    sendCommand(command, data) {
        this.socket.emit(command, data);
    }
    // End: Sending commands

}