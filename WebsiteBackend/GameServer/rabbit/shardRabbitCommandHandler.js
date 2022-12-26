const RabbitMessage = require("../../../shared/rabbitMessage");
const AccessManager = require("../admin/accessManager");
const ServerNetworkManager = require("../network/serverNetworkManager");
const ShardRabbitCommunicator = require("./shardRabbitCommunicator");

class ShardRabbitCommandHandler {

    /**
     * @param {ShardRabbitCommunicator} rabbitCommunicator
     * @param {ServerNetworkManager} networkManager 
     * @param {AccessManager} accessManager
     */
    constructor(rabbitCommunicator, networkManager, accessManager) {
        this.networkManager = networkManager;
        this.rabbitCommunicator = rabbitCommunicator;
        this.accessManager = accessManager;
    }

    /**
     * 
     * @param {RabbitMessage} message 
     */
    handleCommand(message) {
        try {
            switch (message.command) {
                case RabbitMessage.RABBIT_COMMANDS.FROM_LOGIN_WEBSITE.DEPLOY_TO_GAME_IF_POSSIBLE:
                    const userID = message.args.playerData.discordAPI.id;
                    //may join?
                    const accessObject = this.accessManager.mayJoin(message.args.playerData);
                    if (accessObject.status === 1) {
                        logCommandHandler("Access granted!");
                        const pw = this.networkManager.addPasswordAccessFor(userID);
                        this.rabbitCommunicator.sendDeployPlayerSuccessToLogin(message.correlationID, pw, accessObject);
                    } else {
                        logCommandHandler("Access denied to " + userID + " with reason " + accessObject.error);
                        this.rabbitCommunicator.sendDeployPlayerFailToLogin(message.correlationID, accessObject);
                    }
                    break;
                default:
                    throw "Unknown command received: " + message.command;
            }
        } catch (error) {
            errorCommandHandler("Error while handling command " + message.command + ": " + error);
        }
    }
}

function errorCommandHandler(s) {
    console.trace("[RabbitCommandHandler] " + s);
}

function logCommandHandler(s) {
    console.log("[RabbitCommandHandler] " + s);
}

module.exports = ShardRabbitCommandHandler;