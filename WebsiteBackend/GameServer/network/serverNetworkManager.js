const { Server } = require("socket.io");
const NetworkCommands = require("../../GameStatic/js/network/networkCommands");
const Protagonist = require("../player/protagonist");
const MovableBody = require("../physics/movableBody");
const PasswordGenerator = require("./passwordGenerator");

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

        this.openPasswordAccesses = new Map();      // userID <-> pw
        this.authenticatedPlayerIDs = [];

        io.use((socket, next) => {      // authentication
            if(socket.handshake.auth === undefined || socket.handshake.auth === undefined) {
                console.error("Someone trying to connect without auth string!");
                next(new Error("unauthorized"));
                return;
            }
            const userID = socket.handshake.auth.userID;
            const pw = socket.handshake.auth.pw;
            if(userID === undefined || userID === null) {
                console.error("No user ID given in connect uri!");
                next(new Error("unauthorized"));
                return;
            }
            if(pw === undefined || pw === null) {
                console.error("No pw given in connect uri!");
                next(new Error("unauthorized"));
                return;
            }
            if(!this.openPasswordAccesses.has(userID)) {
                console.error("No PW access available for this user");
                next(new Error("unauthorized"));
                return;
            }
            if(this.openPasswordAccesses.get(userID) !== pw) {
                console.error("Wrong PW for user " + userID + " !");
                next(new Error("unauthorized"));
                return;
            }

            // success
            this.openPasswordAccesses.delete(userID);
            console.log("User authenticated successfully! Removing pw access for " + userID + " now.");
            socket.discordID = userID;
            next();
        }).on('connection', (socket)=>{
            console.log('a user connected');
            const discordID = socket.discordID;
            /**
             * on request player add: 
             * @param {Object} data 
             * @param {number} data.id -  Player id
             */
            socket.on(NetworkCommands.REQUEST_ADD_PLAYER, (data) => {       // handling organisation commands here; gameplay commands in socketUser
                var newPlayerData = instance.mainLoop.addPlayer(socket, data, discordID);
                instance.broadcastToAllPlayers(NetworkCommands.ADD_PLAYER, newPlayerData);
                socket.clientId = data.id;
            });
            socket.on('disconnect', ()=>{
                console.log(this.clientId + ' disconnected!');
                instance.handleDisconnect(socket.clientId);
            });

        });
    }

    addPasswordAccessFor(userID) {
        const pw = PasswordGenerator.generatePassword();
        this.openPasswordAccesses.set(userID, pw);
        console.log("Addes password access for " + userID + " with password " + pw);
        return pw;
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
     * @param {Object[]} data
     * @param {string} data[0].id 
     */
    sendRemoveMobsCommand(data) {
        this.broadcastToAllPlayers(NetworkCommands.REMOVE_GAMEOBJECTS, data);
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