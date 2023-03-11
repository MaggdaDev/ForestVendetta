const IDGenerator = require("../../../shared/idGen/idGenerator");
const RabbitConnection = require("../../../shared/rabbitConnection");
const RabbitMessage = require("../../../shared/rabbitMessage");

/**
 * @description scheduler rabbit communicator
 */
class SchedulerRabbitCommunicator {
    /**
     * 
     * @param {RabbitConnection} rabbitConnection 
     */
    constructor(rabbitConnection, commandHandler) {
        this.rabbitConnection = rabbitConnection;
        this.commandHandler = commandHandler;
        this.rabbitConnection.onMessageToScheduler((message) => commandHandler.handle(message));
    }

    sendCreateShardCommandThen(gameID, thenFunc) {
        this.rabbitConnection.sendToQueueAndHandleReply(
            RabbitConnection.QUEUES.toShardManager,
            new RabbitMessage(RabbitMessage.RABBIT_COMMANDS.FROM_SCHEDULER.CREATE_SHARD,
                {
                    gameID: gameID
                }),
            thenFunc);
    }

    sendSaveItemsConfirmation(msg) {
        this.rabbitConnection.sendReplyTo(msg, {}, msg.args.shardQueue);
    }

    /**
     * 
     * @param {string} displayName - name of the boss for discord chat
     * @param {number} channelID  - channelID of channel to send message to
     */
    sendSpawnBossCommand(displayName, channelID, adress) {
        this.rabbitConnection.sendToDiscordBot(new RabbitMessage(RabbitMessage.RABBIT_COMMANDS.FROM_SCHEDULER.SEND_SPAWN_BOSS_MESSAGE, {
            channelID: channelID,
            displayName: displayName,
            adress: adress
        }))
    }

    sendTestMessage() {
        this.rabbitConnection.sendToDiscordBot(new RabbitMessage(RabbitMessage.RABBIT_COMMANDS.FROM_SCHEDULER.SEND_TEST_MESSAGE));
    }

}

module.exports = SchedulerRabbitCommunicator;