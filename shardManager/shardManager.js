const RabbitConnection = require("../shared/rabbitConnection");
const RabbitComandHandler = require("./rabbitCommunication/rabbitCommandHandler");

class ShardManager {

    /**
     * 
     * @param {RabbitConnection} rabbitConnection 
     */
    constructor(rabbitConnection) {
        this.rabbitConnection = rabbitConnection;
        this.rabbitCommandHandler = new RabbitComandHandler(this);
        this.rabbitConnection.onMessageToShardHandler((message) => this.rabbitCommandHandler.handle(message));
    }

    /**
     * 
     * @param {number} port 
     */
    createShard(message) {
        console.log("Creating shard...");
    }
}

module.exports = ShardManager;