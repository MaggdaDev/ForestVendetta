const RabbitConnection = require("../../../shared/rabbitConnection");
const RabbitMessage = require("../../../shared/rabbitMessage");

class ShardRabbitCommunicator {

    /**
     * 
     * @param {RabbitConnection} rabbitConnection - 
     * @param {string} gameID - should be from IDGenerator.instance().nextGameID()
     */
    constructor(rabbitConnection, gameID) {
        this.rabbitConnection = rabbitConnection;
        this.rabbitConnection.assertCustomQueue(gameID);
        this.gameQueueName = gameID;
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