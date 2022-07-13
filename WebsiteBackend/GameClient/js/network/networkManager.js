
class NetworkManager {
    /**
     * 
     * @param {Phaser.Scene} scene 
     */
    constructor(scene) {
        console.log("Creating Network manager...");
        this.mainScene = scene;

        console.log("Creating socket...")
        this.socket = io();
        
        this.clientId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        console.log("ClientId created: " + this.clientId);

        
        // Start: registering command handling
        this.socket.on(NetworkCommands.ADD_PLAYER, (data)=>this.addPlayer(data));
        this.socket.on(NetworkCommands.SETUP_WORLD, (data)=>this.setupWorld(data));
        this.socket.on(NetworkCommands.UPDATE_PLAYERS, (data)=>this.updatePlayers(data));
        this.socket.on(NetworkCommands.SHOW_OLD_PLAYERS, (data)=>this.showOldPlayers(data));
        this.socket.on(NetworkCommands.DISCONNECT_PLAYER, (data)=>this.disconnectPlayer(data));
        this.socket.on(NetworkCommands.UPDATE_WORLD, (data)=>this.updateWorld(data));
        this.socket.on(NetworkCommands.UPDATE, (data)=>this.update(data));
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
        this.mainScene.showOldPlayers(data);
    }

    /**
     * 
     * @param {number} id - unique player clientId 
     */
    disconnectPlayer(id) {
        this.mainScene.disconnectPlayer(id);
    }


    /**
     * 
     * @param {Object[]} data - all update objects, [{update:'PLAYERS',data:}, {update:'WORLD', data:}]
     */
    update(data) {
        console.log('Update: ' + JSON.stringify(data));
        this.mainScene.updateWorld(data.world);
        this.mainScene.updatePlayers(data.players);
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