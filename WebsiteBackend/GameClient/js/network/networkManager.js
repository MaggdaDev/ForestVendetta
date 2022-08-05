
class NetworkManager {
    /**
     * 
     * @param {Phaser.Scene} scene 
     */
    constructor(scene, mobManager) {
        console.log("Creating Network manager...");
        this.mainScene = scene;

        console.log("Creating socket...")
        this.socket = io();
        
        this.clientId = "P" + String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        console.log("ClientId created: " + this.clientId);

        this.mobManager = mobManager;

        
        // Start: registering command handling
        this.socket.on(NetworkCommands.ADD_PLAYER, (data)=>this.addPlayer(data));
        this.socket.on(NetworkCommands.SETUP_WORLD, (data)=>this.setupWorld(data));
        this.socket.on(NetworkCommands.UPDATE_PLAYERS, (data)=>this.updatePlayers(data));
        this.socket.on(NetworkCommands.SHOW_OLD_PLAYERS, (data)=>this.showOldPlayers(data));
        this.socket.on(NetworkCommands.SHOW_OLD_MOBS, (data)=>this.showOldMobs(data));
        this.socket.on(NetworkCommands.DISCONNECT_PLAYER, (data)=>this.disconnectPlayer(data));
        this.socket.on(NetworkCommands.UPDATE_WORLD, (data)=>this.updateWorld(data));
        this.socket.on(NetworkCommands.UPDATE, (data)=>this.update(data));
        this.socket.on(NetworkCommands.CONTROL_DATA, (data)=>this.controlData(data));
        this.socket.on(NetworkCommands.SPAWN_MOB, (data)=>this.spawnMob(data));
        this.socket.on(NetworkCommands.COOLDOWN, (data) => this.cooldown(data));
        this.socket.on(NetworkCommands.DAMAGE_ANIMATION, (data)=>this.damageAnimation(data));
        this.socket.on(NetworkCommands.REMOVE_GAMEOBJECTS, (data)=>this.removeGameObjects(data));
        
        // End: registering command handling

        console.log("NetworkManager created.")
    }

    // Start: Handling commands

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
        this.mainScene.physicsInfo.updateText(data);
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
     * @param {string} data.weaponId
     * @param {number} data.time
     */
    cooldown(data) {
        this.mainScene.cooldown(data);
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

    // End: Handling commands


    // Start: Sending commands
    sendRequestAddPlayer() {
        this.sendCommand(NetworkCommands.REQUEST_ADD_PLAYER, {id: this.clientId});
    }

    sendPlayerControl(control) {
        this.sendCommand(NetworkCommands.PLAYER_CONTROL, control);
    }


    sendCommand(command, data) {
        this.socket.emit(command, data);
    }
    // End: Sending commands

}