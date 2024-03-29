const MongoAccessor = require("../../shared/mongoAccess/mongoAccessor");
const RabbitConnection = require("../../shared/rabbitConnection");
const MainLoop = require("./mainLoop");
const SchedulerMongoAccessor = require("./mongo/schedulerMongoAccessor");
const DropConstructor = require("./partTimeJobs/dropConstructor");
const RabbitCommandHandler = require("./rabbit/schedulerRabbitCommandHandler");
const RabbitCommunicator = require("./rabbit/schedulerRabbitCommunicator");
const GuildSpawnInfo = require("./spawning/guildSpawnInfo");
const Spawner = require("./spawning/spawner");
const WorldInitializer = require("./spawning/worldInititalizer");

class Scheduler {
    /**
     * 
     * @param {RabbitConnection} rabbitConnection 
     * @param {MongoAccessor} mongoAccessor
     */
    constructor(rabbitConnection, mongoAccessor, isTestMode) {
        this.isTestMode = isTestMode;
        this.schedulerMongoAccessor = new SchedulerMongoAccessor(mongoAccessor);
        this.dropConstructor = new DropConstructor(this.schedulerMongoAccessor);
        this.rabbitCommandHandler = new RabbitCommandHandler(this, this.dropConstructor);
        this.rabbitCommunicator = new RabbitCommunicator(rabbitConnection, this.rabbitCommandHandler);
        this.worldInitializer = new WorldInitializer(this.rabbitCommunicator);
        this.spawner = new Spawner(this.worldInitializer);
        this.mainLoop = new MainLoop(this, this.spawner, this.isTestMode);
        this.spawner.loadConfig();

        // todo: get guild info
        this.guildSpawnInfos = [];
        this.guildSpawnInfos.push(new GuildSpawnInfo("1018493683093475419"));
        this.guildSpawnInfos.push(new GuildSpawnInfo("1018493700969611275"));
        this.guildSpawnInfos.push(new GuildSpawnInfo("1018493716102656001"));
    }

    startMainLoop() {
        this.mainLoop.start();
    }
}

module.exports = Scheduler;