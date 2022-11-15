const fs = require('node:fs');
const path = require('path');
const SchedulerRabbitCommunicator = require('../rabbit/schedulerRabbitCommunicator');
const Randomizer = require('./randomizer');
class Spawner {
    static CONFIG_PATH = "../WebsiteBackend/GameplayConfig/Bosses";
    static MILLIS_PER_DAY = 1000 * 60 * 60 * 24;

    /**
     * 
     * @param {SchedulerRabbitCommunicator} rabbitCommunicator 
     */
    constructor(worldInitializer) {
        this.bossConfigs = new Map();
        this.randomizer = new Randomizer();
        this.worldInitializer = worldInitializer;
    }

    /**
     * 
     * @param {number} interval - time between ticks in ms
     * @param {Object} guildInfo - info object about guild to spawn in
     * @param {number} channelID - channel ID to spawn in
     */
    spawnTick(interval, guildInfo) {
        var currProb;
        const instance = this;
        this.bossConfigs.forEach((currConfig) => {
            if (this.canSpawn(currConfig)) {
                currProb = currConfig.spawn_config.per_day / (Spawner.MILLIS_PER_DAY / interval);
                this.randomizer.executeWithProb(()=>{
                    instance.spawn(currConfig, guildInfo);
                }, currProb);
            }
        });
    }

    spawn(bossConfig, guildInfo) {
        this.worldInitializer.initializeWorld(bossConfig, guildInfo);
        
    }

    canSpawn(config) {
        if (Object.hasOwn(config, 'spawn_config')) {
            if (Object.hasOwn(config.spawn_config, 'per_day') && 
            Object.hasOwn(config.spawn_config, 'display_name')) {
                return true;
            }
        }
        return false;
    }

    loadConfig() {
        const absPath = path.resolve(Spawner.CONFIG_PATH);
        console.log("Trying to load boss config files from '" + absPath + "'...");
        const configFiles = fs.readdirSync(path.resolve(absPath));
        var currAdd;
        var counter = 0;
        configFiles.forEach(currConfigFile => {
            currAdd = require(absPath + "/" + currConfigFile);
            this.bossConfigs.set(currAdd.name, currAdd);
            counter += 1;
        });
        console.log("Successfully loaded " + counter + " boss configs.");
        return this.bossConfigs;
    }
}

module.exports = Spawner;