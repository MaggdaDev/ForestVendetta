const amqp = require('amqplib/callback_api');
class RabbitConnection {
    static QUEUES = {
        toDiscordBot: 'toDiscordBot',
        toScheduler: 'toScheduler',
        toShardManager: 'toShardManager'
    }
    constructor() {
        logRabbit("Initializing rabbit connection...")

        // requiring connect string
        const CONFIG_LOCATION = '../config-example';
        const CONFIG_NAME = 'rabbitmq';
        this.connectConfig = require(CONFIG_LOCATION + "/" + CONFIG_NAME);

        // connect
        logRabbit("Loaded connect config from '" + CONFIG_LOCATION + "/" + CONFIG_NAME + "' : " + JSON.stringify(this.connectConfig));

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
                    instance._connectUntilSuccessRecursion(interval);
                });
        }, 2000);
        return prom;
    }

    _connectUntilSuccessRecursion(interval) {
        const instance = this;
        const prom = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.connect()
                    .then(() => resolve())
                    .catch((error) => {
                        logRabbit("Can't connect to rabbit! Retrying in " + interval + "ms...");
                        instance._connectUntilSuccessRecursion(interval);
                    });
            }, interval);

        });
        return prom;
    }
    // connecting end


    // sending start
    sendToScheduler(message) {
        this.checkConnection();
        this.channel.sendToQueue(RabbitConnection.QUEUES.toScheduler, Buffer.from(message));
        logRabbit("sent message to scheduler: " + message);
    }

    sendToDiscordBot(message) {
        this.checkConnection();
        this.channel.sendToQueue(RabbitConnection.QUEUES.toDiscordBot, Buffer.from(message));
        logRabbit("sent message to discordbot: " + message);
    }
    //sending end

    //consuming start
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
            handler(message);
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