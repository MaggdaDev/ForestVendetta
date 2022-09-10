const RabbitConnection = require('../../../shared/rabbitConnection');
const RabbitCommandHandler = require('./discordRabbitCommandHandler');
/**
 * @description discordbot rabbit communicator
 */
class DiscordRabbitCommunicator {
    /**
     * @param {RabbitConnection} rabbitConnection
     * @param {RabbitComandHandler} commandHandler 
     */
    constructor(rabbitConnection, commandHandler) {
        this.commandHandler = commandHandler;
        this.rabbitConnection = rabbitConnection;
        this.rabbitConnection.onMessageToDiscordBot((message)=>this.commandHandler.handle(message));
    }


}

module.exports = DiscordRabbitCommunicator;