const RabbitConnection = require("../../../shared/rabbitConnection");
const RabbitMessage = require("../../../shared/rabbitMessage");
const ShardRabbitCommandHandler = require("./shardRabbitCommandHandler");

class ShardRabbitCommunicator {

    /**
     * 
     * @param {RabbitConnection} rabbitConnection - 
     * @param {string} gameID - should be from IDGenerator.instance().nextGameID()
     */
    constructor(rabbitConnection, gameID, networkManager, shardUri) {
        this.shardUri = shardUri;
        this.rabbitConnection = rabbitConnection;
        this.rabbitConnection.assertCustomQueue(gameID);
        this.rabbitCommandHandler = new ShardRabbitCommandHandler(this, networkManager);
        this.gameQueueName = gameID;

        this.rabbitConnection.onMessageToCustomQueue((message) => this.rabbitCommandHandler.handleCommand(message), this.gameQueueName)
    }

    sendDeployPlayerSuccessToLogin(requestDeployMessageID, pw) {
        // create uri with password:
        var retUri = this.shardUri + "?pw=" + pw;
        this.rabbitConnection.sendToLoginWebsite(RabbitMessage.fromCorrelationID(requestDeployMessageID, {status: 1, shardUri: retUri}));       // status: 1/0 success/not  retUri: uri?pw=123
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