const RabbitConnection = require("../../shared/rabbitConnection");
const MainLoop = require("./mainLoop");

class Scheduler {
    /**
     * 
     * @param {RabbitConnection} rabbitConnection 
     */
    constructor(rabbitConnection) {
        this.rabbitConnection = rabbitConnection;
        this.rabbitConnection.sendToDiscordBot('u are a nignog');
        this.rabbitConnection.onMessageToScheduler((message)=> {
            console.log(message.content.toString());
        })

        this.mainLoop = new MainLoop(this);
    }

    sendTestMessage() {
        this.rabbitConnection.sendToDiscordBot('testMessage');
    }

    startMainLoop() {
        this.mainLoop.start();
    }
}

module.exports = Scheduler;