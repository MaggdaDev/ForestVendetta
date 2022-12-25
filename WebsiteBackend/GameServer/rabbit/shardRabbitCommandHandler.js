const RabbitMessage = require("../../../shared/rabbitMessage");
const ServerNetworkManager = require("../network/serverNetworkManager");
const ShardRabbitCommunicator = require("./shardRabbitCommunicator");

class ShardRabbitCommandHandler {

    /**
     * @param {ShardRabbitCommunicator} rabbitCommunicator
     * @param {ServerNetworkManager} networkManager 
     */
    constructor(rabbitCommunicator, networkManager) {
        this.networkManager = networkManager;
        this.rabbitCommunicator = rabbitCommunicator;
    }

    /**
     * 
     * @param {RabbitMessage} message 
     */
     handleCommand(message) {
        try {
            switch (message.command) {
                case RabbitMessage.RABBIT_COMMANDS.FROM_LOGIN_WEBSITE.DEPLOY_TO_GAME_IF_POSSIBLE:
                    const userID = message.args.userID;
                    const pw = this.networkManager.addPasswordAccessFor(userID);
                    this.rabbitCommunicator.sendDeployPlayerSuccessToLogin(message.correlationID, pw);
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

module.exports = ShardRabbitCommandHandler;