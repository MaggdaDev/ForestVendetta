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

    sendTestMessage() {
        this.rabbitConnection.sendToDiscordBot(new RabbitMessage(RabbitMessage.RABBIT_COMANDS.FROM_SCHEDULER.SEND_TEST_MESSAGE));
    }

}

module.exports = SchedulerRabbitCommunicator;