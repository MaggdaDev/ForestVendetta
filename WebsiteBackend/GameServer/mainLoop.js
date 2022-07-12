const Protagonist = require('./player/protagonist');
const Platform = require('./world/platform');
const World = require('./world/world');
class MainLoop {

    constructor(playerList) {
        console.log("Main Loop created!")
        this.oldTime = Date.now();
        this.lastLog = 0;
        this.timeElapsed = 0;
        this.players = playerList;
        this.playerUpdateData = new Map();

        this.world = new World();
        this.world.buildWorld();
    }

    /**
     * 
     * @param {Object} data 
     * @param {number} data.id -  Player id
     * @param {Object} socket - socket object
     */

    /*
    @param {number} timeElapsed - Elapsed time in milliseconds
    */
    update(timeElapsed) {
        this.updateAllPlayers(timeElapsed);
        this.allPlayersSendUpdate(this.playerUpdateData);
    }

    /**
     * 
     * @param {Object[]} playerUpdateData 
     */
    allPlayersSendUpdate(playerUpdateData) {
        var instance = this;
        this.players.forEach(function (player) {
            player.sendUpdate(instance.playerUpdateData);
        });
    }

    updateAllPlayers(timeElapsed) {
        var instance = this;
        this.players.forEach(function (player, id, map) {
            player.update(timeElapsed, instance.players);
        });
    }

    

    /*
    @param {Object} instance - this instance
    */
    loop(instance) {
        instance.timeElapsed = (Date.now() - instance.oldTime) / 1000.0;
        instance.oldTime = Date.now();
        if (instance.oldTime - instance.lastLog > 3000) {
            instance.lastLog = instance.oldTime;
            console.log("Mainloop running");
        }
        instance.update(instance.timeElapsed);

    }

    start() {
        var self = this
        setInterval(function () {
            self.loop(self);
        }, 30);
    }

    addPlayer(socket, data) {
        console.log("Register: " + data);
        var newPlayer = new Protagonist(data.id, socket, this.world, this);
        newPlayer.showOldPlayers(this.players);
        this.players.set(data.id, newPlayer);
        this.playerUpdateData.set(data.id, newPlayer.data);     // IMPORTANT ON EVERY ADD!!!
        return newPlayer.data;
    }

    handleDisconnect(clientId) {
        this.players.delete(clientId);
        this.playerUpdateData.delete(clientId);            /// IMPORTANT!
    }





}
module.exports = MainLoop;