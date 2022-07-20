const NetworkCommands = require('../GameStatic/js/network/networkCommands');
const Protagonist = require('./player/protagonist');
const Platform = require('./world/platform');
const World = require('./world/world');
const WorldLoader = require('./world/worldLoader');
class MainLoop {

    constructor(playerList) {
        console.log("Main Loop created!")
        this.oldTime = Date.now();
        this.lastLog = 0;
        this.timeElapsed = 0;
        this.players = playerList;

        this.worldLoader = new WorldLoader();
        this.world = this.worldLoader.loadWorld();

        this.networkManager = undefined;
        this.updateData = this.collectUpdateData();
        console.log(JSON.stringify(this.updateData));

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
        this.updateWorld(timeElapsed);
        this.updateAllPlayers(timeElapsed);
        this.allPlayersSendUpdate(this.updateData);
        
    }

    updateWorld(timeElapsed) {
        this.networkManager.broadcastToAllPlayers(NetworkCommands.CONTROL_DATA, JSON.stringify(this.world.update(timeElapsed)));
    }


    /**
     * 
     * @param {Object[]} data - all update data, see networkCommands#UPDATE for more info 
     */
    allPlayersSendUpdate(data) {
        this.players.forEach(function (player) {
            player.sendUpdate(data);
        });
    }

    updateAllPlayers(timeElapsed) {
        var instance = this;
        this.players.forEach(function (player, id, map) {
            player.update(timeElapsed, instance.players);
        });
    }

    collectUpdateData() {
        var instance = this;
        return {
            toJSON() {
                return {
                    players: instance.sendablePlayerUpdateData,
                    world: instance.world.clientWorldUpdateData
                }
            }
        }
    }

    get sendablePlayerUpdateData() {
        var ret = [];
        this.players.forEach((curr)=>{
            ret.push(curr);
        });
        return ret;
    }
    

    /*
    @param {Object} instance - this instance
    */
    loop(instance) {
        instance.timeElapsed = (Date.now() - instance.oldTime) / 1000.0;
        instance.oldTime = Date.now();
        if(instance.timeElapsed > 0.1) {
            console.log("More than 100ms in server loop. Cropping time elapsed.");
            instance.timeElapsed = 0.1;
        }
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
        console.log("Register: " + JSON.stringify(data));
        var newPlayer = new Protagonist(data.id, socket, this.world, this);
        newPlayer.showOldPlayers(this.players);
        this.players.set(data.id, newPlayer);
        return newPlayer;
    }

    handleDisconnect(clientId) {
        this.players.delete(clientId);
    }





}
module.exports = MainLoop;