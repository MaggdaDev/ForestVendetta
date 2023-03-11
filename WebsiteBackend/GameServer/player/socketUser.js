const NetworkCommands = require("../../GameStatic/js/network/networkCommands");

class SocketUser {
    /**
     * 
     * @param {Socket} socket 
     * @param {Protagonist} owner 
     */
    constructor(socket, owner) { 
        this.socket = socket;
        this.owner = owner;

        var instance = this;
        
        // START: register command handling         // handling gameplay commands here; organisation commands in server network manager
        this.socket.on(NetworkCommands.PLAYER_CONTROL, (data)=>this.playerControl(data));
        this.socket.on(NetworkCommands.REQUEST_SELECT_ITEM, (data)=>this.selectItem(data.index));
        this.socket.on(NetworkCommands.REQUEST_LEAVE_GAME, (data)=>this.requestLeaveGame(data.id));
        // END: register command handling
    }

    // START: command handling

    requestLeaveGame(id) {
        console.log("Command received!");
        this.owner.handleLeaveGameRequest();
    }

    

    /**
     * 
     * @param {string} control - player control receiver; element of PlayerControls.X_Y_Z 
     */
    playerControl(control) {
        this.owner.playerControl(control);
    }

    /**
     * 
     * @param {number} index 
     */
    selectItem(index) {
        this.owner.selectItem(index);
    }

    // END: command handling

    // START: command sending

    sendRedirectToHome() {
        this.sendCommand(NetworkCommands.REDIRECT_TO_HOME, {id:this.owner.id, url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"});
        console.log("Emitted redirect to home command");
    }

    sendShowSavingProgressScreen() {
        this.sendCommand(NetworkCommands.SHOW_SAVING_PROGRESS_SCREEN);
        console.log("Emitted show saving progress screen");
    }

    sendWorldData(world) {
        this.sendCommand(NetworkCommands.SETUP_WORLD, world);
        console.log('Emitted world object.')
    }

    /**
     * 
     * @param {Object[]} updateData - all update data, see networkCommands#UPDATE for more 
     */
    sendUpdate(updateData) {
        this.sendCommand(NetworkCommands.UPDATE, updateData);
    }

    /**
     * 
     * @param {Object} data - data object for old players init 
     */
    showOldPlayers(data) {
        this.sendCommand(NetworkCommands.SHOW_OLD_PLAYERS, data);
    }

    /**
     * 
     * @param {Object[]} data 
     */
    showOldMobs(data) {
        this.sendCommand(NetworkCommands.SHOW_OLD_MOBS, data);
    }

    sendCommand(command, data) {
        this.socket.emit(command, data);
    }

    // END: command sending

    
}

module.exports = SocketUser;