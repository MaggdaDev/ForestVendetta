const NetworkCommands = require('../GameStatic/js/network/networkCommands');
const MobManager = require('./mobs/mobManager');
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
              

    }

    init() {        // after constructor before start; after network manager is created
        this.mobManager = new MobManager(this.networkManager, this.players, this.world);  // after network manager is created
        this.updateData = this.collectUpdateData();     // after mob manager is created
        this.mobManager.spawnFrog(200,200);
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
        var worldIntersectables = this.world.intersectables;
        var mobIntersectables = this.mobManager.mobArray;
        var playerIntersectables = this.playerIntersectables;
        this.updateWorld(timeElapsed, worldIntersectables, mobIntersectables, playerIntersectables);
        this.updateAllPlayers(timeElapsed, worldIntersectables, mobIntersectables, playerIntersectables);
        this.mobManager.updateMobs(timeElapsed, worldIntersectables, mobIntersectables, playerIntersectables);
        this.allPlayersSendUpdate(this.updateData);
        
    }

    updateWorld(timeElapsed, ws, ms, ps) {
        this.networkManager.broadcastToAllPlayers(NetworkCommands.CONTROL_DATA, JSON.stringify(this.world.update(timeElapsed, ws, ms, ps)));
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

    updateAllPlayers(timeElapsed, ws, ms, ps) {
        var instance = this;
        this.players.forEach(function (player, id, map) {
            player.update(timeElapsed, ws, ms, ps);
        });
    }

    collectUpdateData() {
        var instance = this;
        return {
            toJSON() {
                return {
                    players: instance.sendablePlayerUpdateData,
                    world: instance.world.clientWorldUpdateData,
                    mobs: instance.mobManager.mobUpdateData
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

    get playerIntersectables() {
        return Array.from(this.players.values());
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
        newPlayer.showOldMobs(this.mobManager);
        this.players.set(data.id, newPlayer);
        return newPlayer;
    }

    handleDisconnect(clientId) {
        this.players.delete(clientId);
    }





}
module.exports = MainLoop;