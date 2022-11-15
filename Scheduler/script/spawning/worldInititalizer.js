const IDGenerator = require("../../../shared/idGen/idGenerator");

class WorldInitializer {
    constructor(rabbitCommunicator) {
        this.rabbitCommunicator = rabbitCommunicator;
    }

    initializeWorld(bossConfig, guildInfo) {
        const gameID = IDGenerator.instance().nextGameID();
        this.rabbitCommunicator.sendCreateShardCommandThen(gameID, (args)=> this.onShardCreated(bossConfig, guildInfo, args));
    }

    onShardCreated(bossConfig, guildInfo, args) {
        console.log("Reply caught: Shard started! Now sending discord notification...");
        this.sendSpawnBossCommand(bossConfig, guildInfo, args.adress);
    }

    sendSpawnBossCommand(bossConfig, guildInfo, adress) {
        this.rabbitCommunicator.sendSpawnBossCommand(bossConfig.spawn_config.display_name, guildInfo.channelID, adress);
    }

    sendCreateShardCommand
}

module.exports = WorldInitializer;