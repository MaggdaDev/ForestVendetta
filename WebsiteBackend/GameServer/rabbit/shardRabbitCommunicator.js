const RabbitConnection = require("../../../shared/rabbitConnection");
const RabbitMessage = require("../../../shared/rabbitMessage");
const ShardRabbitCommandHandler = require("./shardRabbitCommandHandler");

class ShardRabbitCommunicator {

    /**
     * 
     * @param {RabbitConnection} rabbitConnection - 
     * @param {string} gameID - should be from IDGenerator.instance().nextGameID()
     */
    constructor(rabbitConnection, gameID, networkManager, shardAccessUri, accessManager) {
        this.shardUri = shardAccessUri;
        this.rabbitConnection = rabbitConnection;
        this.rabbitConnection.assertCustomQueue(gameID);
        this.rabbitCommandHandler = new ShardRabbitCommandHandler(this, networkManager, accessManager);
        this.gameQueueName = gameID;

        this.rabbitConnection.onMessageToCustomQueue((message) => this.rabbitCommandHandler.handleCommand(message), this.gameQueueName)
    }

    sendDeployPlayerSuccessToLogin(requestDeployMessageID, pw, accessObject) {
        // create uri with password:
        accessObject.shardUri = this.shardUri;
        if(accessObject.shardUri.includes("?")) {
            accessObject.shardUri += "&pw=" + pw;
        } else {
            accessObject.shardUri += "?pw=" + pw;
        }
        this.rabbitConnection.sendToLoginWebsite(RabbitMessage.fromCorrelationID(requestDeployMessageID, accessObject));       // status: 1 success  retUri: uri?pw=123
    }

    sendDeployPlayerFailToLogin(requestDeployMessageID, accessObject) {
        this.rabbitConnection.sendToLoginWebsite(RabbitMessage.fromCorrelationID(requestDeployMessageID, accessObject));    // status: 0 error (from AccessManager.REJECT_REASONS)
    }

    /**
     * 
     * @param {string} userID 
     * @param {Object[]} drops 
     * @param {function} onFinished @optional
     * @param {string} queueName name for reply queue
     */
    sendDropsToScheduler(userID, drops, onFinished, queueName) {
        const msg = new RabbitMessage(RabbitMessage.RABBIT_COMMANDS.FROM_SHARDS.CONSTRUCT_DROPS, { userID: userID, drops: drops, shardQueue: queueName});
        if (onFinished === undefined) {
            this.rabbitConnection.sendToScheduler(msg);
            console.log("Sent items to scheduler and NOT waiting.");
        } else {
            this.rabbitConnection.sendToQueueAndHandleReply(RabbitConnection.QUEUES.toScheduler, msg, (args) => onFinished(args));
            console.log("Sent items to scheduler and awaiting response...");
        }
    }

    /**
     * 
     * @param {string} createMessageID - messageID from IDGenerator. Should be correlationID of createShard message from scheduler to shardManager
     * @param {string} adress - http adress of shard
     */
    sendCreateSuccess(createMessageID, adress) {
        this.rabbitConnection.sendToScheduler(RabbitMessage.fromCorrelationID(createMessageID, { adress: adress }));
    }
}

module.exports = ShardRabbitCommunicator;