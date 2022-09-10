const RabbitConnection = require("../../shared/rabbitConnection");

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
    }
}

module.exports = Scheduler;