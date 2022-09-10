const RabbitMessage = require("../../../shared/rabbitMessage");

/**
 * @description scheduler rabbit commandhandler
 */
class SchedulerRabbitCommandHandler {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }

    /**
     * 
     * @param {RabbitMessage} message 
     */
    handle(message) {
        switch(message.command) {
            default:
                throw "Unknown command received: " + message.command;
        }
    }
}

module.exports = SchedulerRabbitCommandHandler;