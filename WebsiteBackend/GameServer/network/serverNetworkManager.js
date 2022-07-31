const { Server } = require("socket.io");
const NetworkCommands = require("../../GameStatic/js/network/networkCommands");
const Protagonist = require("../player/protagonist");
const MovableBody = require("../physics/movableBody");

class ServerNetworkManager {

    /**
     * 
     * @param {Protagonist[]} players 
     */
    constructor(io, players, mainLoop) {
        this.io = io;
        this.playerArray = players;
        this.mainLoop = mainLoop;
        this.mainLoop.networkManager = this;

        var instance = this;

        io.on('connection', (socket)=>{
            console.log('a user connected');

            /**
             * on request player add: 
             * @param {Object} data 
             * @param {number} data.id -  Player id
             */
            socket.on(NetworkCommands.REQUEST_ADD_PLAYER, (data) => {       // handling organisation commands here; gameplay commands in socketUser
                var newPlayerData = instance.mainLoop.addPlayer(socket, data);
                instance.broadcastToAllPlayers(NetworkCommands.ADD_PLAYER, newPlayerData);
                socket.clientId = data.id;
            });
            socket.on('disconnect', ()=>{
                console.log(this.clientId + ' disconnected!');
                instance.handleDisconnect(socket.clientId);
            });

        });
    }



    handleDisconnect(clientId) {
        this.mainLoop.handleDisconnect(clientId);
        this.broadcastToAllPlayers(NetworkCommands.DISCONNECT_PLAYER, clientId);
    }

    sendSpawnMobCommand(data) {
        this.broadcastToAllPlayers(NetworkCommands.SPAWN_MOB,data);
    }


    /**
     * 
     * @param {string} command 
     * @param {Object} data 
     */
    broadcastToAllPlayers(command, data) {
        //console.log('Broadcasting to all players: ' + command + "    with data   " + JSON.stringify(data));
        this.playerArray.forEach(curr => {
            curr.sendCommand(command, data);
        });
    }
}

module.exports = ServerNetworkManager;