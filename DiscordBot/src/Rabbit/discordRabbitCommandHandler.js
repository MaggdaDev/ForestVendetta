const RabbitMessage = require("../../../shared/rabbitMessage");
const ForestScout = require("../forestScout");

/**
 * @description discord bot rabbit command handler
 */
class DiscordRabbitCommandHandler {
    /**
     * 
     * @param {ForestScout} forestScout 
     */
    constructor(forestScout) {
        this.forestScout = forestScout;
    }

    /**
     * 
     * @param {RabbitMessage} message 
     */
    handle(message) {
        switch(message.command) {
            case RabbitMessage.RABBIT_COMANDS.FROM_SCHEDULER.SEND_TEST_MESSAGE:
                this.forestScout.sendTestMessage();
            break;
            default:
                throw "Unknown command received: " + message.command;
        }
    }
}

module.exports = DiscordRabbitCommandHandler;