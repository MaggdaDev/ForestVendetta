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
        try {
            switch (message.command) {
                case RabbitMessage.RABBIT_COMMANDS.FROM_SCHEDULER.SEND_TEST_MESSAGE:
                    this.forestScout.discordMessageSender.sendTestMessage();
                    break;
                case RabbitMessage.RABBIT_COMMANDS.FROM_SCHEDULER.SEND_SPAWN_BOSS_MESSAGE:
                    this.forestScout.discordMessageSender.sendBossSpawnedMessage(message.args.channelID, message.args.displayName, message.args.adress);
                    break;
                default:
                    throw "Unknown command received: " + message.command;
            }
        } catch (error) {
            logCommandHandler("Error while handling command " + message.command + ": " + error);
        }
    }
}
function logCommandHandler(s) {
    console.log("[RabbitCommandHandler] " + s);
}

module.exports = DiscordRabbitCommandHandler;