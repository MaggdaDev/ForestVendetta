const amqp = require('amqplib/callback_api');
const IDGenerator = require('./idGen/idGenerator');
const RabbitMessage = require('./rabbitMessage');
class RabbitConnection {
    static QUEUES = {
        toDiscordBot: 'toDiscordBot',
        toScheduler: 'toScheduler',
        toShardManager: 'toShardManager'
    }
    constructor() {
        logRabbit("Initializing rabbit connection...")

        this.awaitedReplies = new Map();

        // requiring connect string
        const CONFIG_LOCATION = '../config-example';
        const CONFIG_NAME = 'rabbitmq';
        this.connectConfig = require(CONFIG_LOCATION + "/" + CONFIG_NAME);

        // connect
        logRabbit("Loaded connect config from '" + CONFIG_LOCATION + "/" + CONFIG_NAME + "' : " + JSON.stringify(this.connectConfig));

    }

    /**
     * 
     * @param {string} queue - PLEASE use RabbitConnection.QUEUES
     * @param {RabbitMessage} message 
     * @param {function(args)} replyHandler 
     */
    sendToQueueAndHandleReply(queue, message, replyHandler) {
        const messageID = IDGenerator.instance().nextMessageID();
        console.log("Setting up reply-await: Message ID '" + messageID + "' generated");
        this.onReplied(messageID, (args)=>{
            console.log("Reply caught successfully! Now executing replyHandler()");
            replyHandler(args);
        });
        message.correlationID = messageID;
        this._sendTo(queue, message);
    }

    // connecting start
    assertQueues(channel) {
        for (var key in RabbitConnection.QUEUES) {
            if (Object.prototype.hasOwnProperty.call(RabbitConnection.QUEUES, key)) {
                var val = RabbitConnection.QUEUES[key];
                channel.assertQueue(val, { durable: false });
            }
        }
    }

    // assert custom queue, i.e. with name [gameID] to address specific shards
    assertCustomQueue(queue) {
        logRabbit("Asserting custom queue: " + queue);
        this.channel.assertQueue(queue, {durable: false});
    }

    connect() {
        var instance = this;
        const prom = new Promise((resolve, reject) => {
            logRabbit("Trying to connect to rabbit using '" + this.connectConfig.miniconnectstring + "...");
            amqp.connect(this.connectConfig.miniconnectstring, (error0, connection) => {
                if (error0) { reject(error0); return }
                logRabbit("Successfully connected to rabbit!");
                instance.connection = connection;                               // important property
                connection.createChannel(function (error1, channel) {
                    if (error1) throw error1;
                    instance.channel = channel;
                    instance.assertQueues(channel);
                    resolve();
                });
            });
        });
        return prom;
    }

    /**
     * 
     * @param {number} interval - time in ms between connection attempts, default 1000
     * @returns 
     */
    connectUntilSuccess(interval) {
        logRabbit("Starting connect until success to rabbit...");
        if (interval === undefined || interval === null) {
            logRabbit("Retry interval was not defined; using 1000ms as default");
            interval = 1000;
        }
        const instance = this;
        logRabbit("Doing first attempt to connect to rabbit...");
        const prom = new Promise((resolve, reject) => {
            this.connect()
                .then(() => {
                    logRabbit("First attempt to connect to rabbit was successful!");
                    resolve()
                })
                .catch((error) => {
                    logRabbit("First attempt to connect to rabbit failed. Starting blocking recursive connection attempts with interval " + interval + "...");
                    instance._connectUntilSuccessRecursion(interval).then(() => {
                        resolve();
                    });
                });
        }, 2000);
        return prom;
    }

    _connectUntilSuccessRecursion(interval) {
        const instance = this;
        const prom = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.connect()
                    .then(() => {
                        resolve()
                    })
                    .catch((error) => {
                        logRabbit("Can't connect to rabbit! Retrying in " + interval + "ms...");
                        instance._connectUntilSuccessRecursion(interval).then(() => {
                            resolve();
                        });
                    });
            }, interval);

        });
        return prom;
    }
    // connecting end


    // sending start

    /**
     * 
     * @param {string} queue - custom queue, i.e. game shard queue
     * @param {RabbitMessage} message 
     */
    sendToCustomQueue(queue, message) {
        this._sendTo(queue, message);
    }
    /**
     * 
     * @param {RabbitMessage} message 
     */
    sendToShardManager(message) {
        this._sendTo(RabbitConnection.QUEUES.toShardManager, message);
    }

    /**
     * 
     * @param {RabbitMessage} message 
     */
    sendToScheduler(message) {
        this._sendTo(RabbitConnection.QUEUES.toScheduler, message);
    }

    /**
     * 
     * @param {RabbitMessage} message 
     */
    sendToDiscordBot(message) {
        this._sendTo(RabbitConnection.QUEUES.toDiscordBot, message);
    }

    /**
     * 
     * @param {string} queue 
     * @param {RabbitMessage} message 
     */
    _sendTo(queue, message) {
        this.checkConnection();
        var msgString = JSON.stringify(message);
        this.channel.sendToQueue(queue, Buffer.from(msgString));
        logRabbit("sent message to queue '" + queue + "': " + msgString + "");
    }
    //sending end

    /**
     * 
     * @param {string} messageID - aka correlationID, should be IDGenerator.instance().nextMessageID()
     * @param {function(args)} onReplyHandler - function that accepts args[]
     */
    onReplied(messageID, onReplyHandler) {
        this.awaitedReplies.set(messageID, onReplyHandler);
        logRabbit("Added awaited reply: wait for ID '" + messageID +"' Now all awaited IDs are: " + Array.from(this.awaitedReplies.keys()).toString());
       
        
    }

    //consuming start

    /**
     * @description SHOULD BE ONLY USED BY SHARDHANDLER
     * @param {function(message)} handler 
     */
    onMessageToShardHandler(handler) {
        this._onMessageToQueue(handler, RabbitConnection.QUEUES.toShardManager);
    }

    /**
     * @description SHOULD BE ONLY USED BY DISCORDBOT
     * @param {function(message)} handler - handler to be executed for every received message 
     */
    onMessageToDiscordBot(handler) {
        this._onMessageToQueue(handler, RabbitConnection.QUEUES.toDiscordBot);
    }

    /**
     * @description SHOULD BE ONLY USED BY SCHEDULER
     * @param {function(message)} handler - handler to be executed for every received message 
     */
    onMessageToScheduler(handler) {
        this._onMessageToQueue(handler, RabbitConnection.QUEUES.toScheduler);
    }

    _onMessageToQueue(handler, queue) {
        this.checkConnection();
        logRabbit("Registering handler for messages in queue '" + queue + "'...");
        this.channel.consume(queue, (message) => {
            logRabbit("Message received from queue '" + queue + "': '" + message.content.toString() + "'.");
            var rabbitMessageObject = JSON.parse(message.content.toString());          // convert string to rabbit message json object (/shared/rabbitMessage.js)
            if (rabbitMessageObject.command === "REPLY") {
                logRabbit("Catching reply before handling! " + rabbitMessageObject.correlationID);
                if (this.awaitedReplies.has(rabbitMessageObject.correlationID)) {
                    logRabbit("Awaited reply received! Now handling reply");
                    this.awaitedReplies.get(rabbitMessageObject.correlationID)(rabbitMessageObject.args);
                    this.awaitedReplies.delete(rabbitMessageObject.correlationID);
                    console.log("Removed caught await, now all awaited IDs are: " + Array.from(this.awaitedReplies.keys()).toString());
                } else {
                    logRabbit("Unknown reply; must belong to other. Skipping usual handling.");
                }
            } else {
                handler(rabbitMessageObject);
            }
        }, {
            noAck: true
        });
    }
    //consuming end

    checkConnection() {
        if (!this.channel) throw "Not connected to rabbit!";
    }

}

function logRabbit(s) {
    console.log("[rabbitConnection] " + s);
}

module.exports = RabbitConnection;