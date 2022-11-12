const RabbitMessage = require("../../shared/rabbitMessage");

class RabbitComandHandler {
    constructor(shardManager) {
        this.shardManager = shardManager;
    }

    handle(message) {
        try {
            switch (message.command) {
                case RabbitMessage.RABBIT_COMMANDS.FROM_SCHEDULER.CREATE_SHARD:
                    this.shardManager.createShard(message);
                    break;
                default:
                    throw "Unknown command received: " + message.command;
            }
        } catch (error) {
            console.log("Error while handling command " + message.command + ": " + error);
        }
    }
    }


module.exports = RabbitComandHandler;