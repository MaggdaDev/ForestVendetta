const RabbitConnection = require("../../../shared/rabbitConnection");
const RabbitMessage = require("../../../shared/rabbitMessage");
const ShardRabbitCommandHandler = require("./shardRabbitCommandHandler");

class ShardRabbitCommunicator {

    /**
     * 
     * @param {RabbitConnection} rabbitConnection - 
     * @param {string} gameID - should be from IDGenerator.instance().nextGameID()
     */
    constructor(rabbitConnection, gameID, networkManager, shardUri, accessManager) {
        this.shardUri = shardUri;
        this.rabbitConnection = rabbitConnection;
        this.rabbitConnection.assertCustomQueue(gameID);
        this.rabbitCommandHandler = new ShardRabbitCommandHandler(this, networkManager, accessManager);
        this.gameQueueName = gameID;

        this.rabbitConnection.onMessageToCustomQueue((message) => this.rabbitCommandHandler.handleCommand(message), this.gameQueueName)
    }

    sendDeployPlayerSuccessToLogin(requestDeployMessageID, pw, accessObject) {
        // create uri with password:
        accessObject.shardUri = this.shardUri + "?pw=" + pw;
        this.rabbitConnection.sendToLoginWebsite(RabbitMessage.fromCorrelationID(requestDeployMessageID, accessObject));       // status: 1 success  retUri: uri?pw=123
    }

    sendDeployPlayerFailToLogin(requestDeployMessageID, accessObject) {
        this.rabbitConnection.sendToLoginWebsite(RabbitMessage.fromCorrelationID(requestDeployMessageID, accessObject));    // status: 0 error (from AccessManager.REJECT_REASONS)
    }

    sendDropsToScheduler(userID, drops) {
        this.rabbitConnection.sendToScheduler(new RabbitMessage(RabbitMessage.RABBIT_COMMANDS.FROM_SHARDS.CONSTRUCT_DROPS, {userID: userID, drops: drops}));
    }

    /**
     * 
     * @param {string} createMessageID - messageID from IDGenerator. Should be correlationID of createShard message from scheduler to shardManager
     * @param {string} adress - http adress of shard
     */
    sendCreateSuccess(createMessageID, adress) {
        this.rabbitConnection.sendToScheduler(RabbitMessage.fromCorrelationID(createMessageID, {adress: adress}));
    }
}

module.exports = ShardRabbitCommunicator;