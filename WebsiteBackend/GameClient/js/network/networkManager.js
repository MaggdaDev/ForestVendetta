
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

        console.log("NetworkManager created.")

        this.socket.on(NetworkCommands.ADD_PLAYER, (data)=>this.addPlayer(data));
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


    // Start: Sending commands
    sendRequestAddPlayer() {
        this.socket.emit(NetworkCommands.REQUEST_ADD_PLAYER, {id: this.clientId});
    }

    // End: Sending commands

}