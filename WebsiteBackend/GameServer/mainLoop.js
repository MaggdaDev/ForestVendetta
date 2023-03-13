const NetworkCommands = require('../GameStatic/js/network/networkCommands');
const Timer = require('../GameStatic/js/util/timer');
const WeaponManager = require('./fighting/weaponManager');
const MobManager = require('./mobs/mobManager');
const Protagonist = require('./player/protagonist');
const Platform = require('./world/platform');
const World = require('./world/world');
const WorldLoader = require('./world/worldLoader');
class MainLoop {
    static MAX_LIFE_TIME = Number.MAX_SAFE_INTEGER;
    
    constructor(playerMap, server) {
        this.server = server;
        
        console.log("Main Loop created!")
        this.oldTime = Date.now();
        this.birthTime = -1;
        this.startTime = -1;
        this.lastLog = 0;
        this.timeElapsed = 0;
        this.players = playerMap;  //Map

        this.worldLoader = new WorldLoader();
        this.world = this.worldLoader.loadWorld();

        this.networkManager = undefined;
        this.timers = [];
    }

    init(rabbitCommunicator) {        // after constructor before start; after network manager is created
        this.rabbitCommunicator = rabbitCommunicator;
        this.weaponManager = new WeaponManager();
        this.mobManager = new MobManager(this.networkManager, this.players, this.world, this.weaponManager);  // after network manager is created
        this.updateData = this.collectUpdateData();     // after mob manager is created
        this.mobManager.spawnRespawningFrog(900, 700);

    }

    /**
     * 
     * @param {Object} data 
     * @param {number} data.id -  Player id
     * @param {Object} socket - socket object
     */

    /*
    @param {number} timeElapsed - Elapsed time in seconds
    */
    update(timeElapsed) {
        var worldIntersectables = this.world.intersectables;
        var mobIntersectables = this.mobManager.mobArray;
        var playerIntersectables = this.playerIntersectables;
        this.updateWorld(timeElapsed, worldIntersectables, mobIntersectables, playerIntersectables);
        this.updateAllPlayers(timeElapsed, worldIntersectables, mobIntersectables, playerIntersectables);
        this.mobManager.updateMobs(timeElapsed, worldIntersectables, mobIntersectables, playerIntersectables);
        this.allPlayersSendUpdate(this.updateData);
        this.updateAllTimers(timeElapsed);

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

    updateAllTimers(timeElapsedSeconds) {
        this.timers.forEach((timer) => timer.update(timeElapsedSeconds * 1000));
    }

    /**
     * 
     * @param {Timer} timer 
     */
    addTimer(timer) {
        this.timers.push(timer);
    }

    get sendablePlayerUpdateData() {
        var ret = [];
        this.players.forEach((curr) => {
            ret.push(curr);
        });
        return ret;
    }

    get playerIntersectables() {
        return Array.from(this.players.values()).filter(player => player.isInteractable);
    }


    /*
    @param {Object} instance - this instance
    */
    loop(instance) {
        instance.timeElapsed = (Date.now() - instance.oldTime) / 1000.0;
        instance.oldTime = Date.now();
        if (instance.timeElapsed > 0.1) {
            console.log("More than 100ms in server loop. Cropping time elapsed.");
            instance.timeElapsed = 0.1;
        }
        if (instance.oldTime - instance.lastLog > 3000) {
            instance.lastLog = instance.oldTime;
            console.log("Mainloop running for " + Math.round(0.001 * (Date.now() - this.startTime)) + "s (after " + Math.round(0.001 * (this.startTime - this.birthTime)) + "s idling)");
        }
        instance.update(instance.timeElapsed);
        if(!this.checkShardALive()) {
            console.log("Shard shall die after " + Math.round(0.001 * (Date.now() - this.startTime)) + "s life (after " + Math.round(0.001 * (this.startTime - this.birthTime)) + "s idling)");
            this.end();
        }
    }

    end() {
        clearInterval(this.intervalID);

        console.log("Disconnecting all players...");
        const playerKeys = Array.from(this.players.keys());
        playerKeys.slice().forEach((element)=> this.handleDisconnect(element));

        console.log("F");
        this.server.close();
        setTimeout(()=> {
            console.log("Murdering process after 500ms waiting for deconstruction.");
            console.log("F");
            process.exit(0);
        }, 500);
        
    }

    /**
     * @description determines wether or not shard should shut down -   100s after birth
     */
    checkShardALive() {
        if(Date.now() - this.birthTime > MainLoop.MAX_LIFE_TIME * 100 && this.players.size === 0) {
            return false;
        } else {
            return true;
        }
    }

    start() {
        console.log("Starting main loop...");
        this.birthTime = Date.now();
        var self = this;
        console.log("Beginning waiting for players...");
        const idleEmptyLobbyIntervalID = setInterval(function () {      // begin idling and waiting for players
            if (self.players.size === 0) {
                console.log("Lobby empty... waiting for " + Math.round(0.001 * (Date.now() - self.birthTime)) + "s...");
            } else {
                console.log("Lobby not empty! Starting mainLoop!");
                clearInterval(idleEmptyLobbyIntervalID);
                self.startTime = Date.now();
                self.intervalID = setInterval(function () {
                    self.loop(self);
                }, 30);
            }
            if(!self.checkShardALive()) {
                console.log("Shard dieing during idle phase.");
                self.end();
            }
        }, 1000);

    }



    addPlayer(socket, data, discordID) {
        console.log("Register: " + JSON.stringify(data));
        const playerData = this.networkManager.getPlayerDataFor(discordID); // delivered when asking if may join
        console.log("Retrieving playerdata successful.");
        var newPlayer = new Protagonist(playerData, socket, this.world, this);
        newPlayer.showOldPlayers(this.players);
        newPlayer.showOldMobs(this.mobManager);
        this.players.set(discordID, newPlayer);
        return newPlayer;
    }

    handleDisconnect(clientId) {
        this.players.get(clientId).goodbyeJojo(this.rabbitCommunicator);
        this.players.delete(clientId);
    }

    broadcastToAllPlayers(command, data) {
        this.networkManager.broadcastToAllPlayers(command, data);
    }





}
module.exports = MainLoop;