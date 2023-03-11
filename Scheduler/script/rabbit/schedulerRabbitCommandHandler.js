const RabbitMessage = require("../../../shared/rabbitMessage");

/**
 * @description scheduler rabbit commandhandler
 */
class SchedulerRabbitCommandHandler {
    constructor(scheduler, dropConstructor) {
        this.scheduler = scheduler;
        this.dropConstructor = dropConstructor;
    }

    /**
     * 
     * @param {RabbitMessage} message 
     */
    handle(message) {   // gets set up as listener in schedulerRabbitCommunicator
        switch(message.command) {
            case RabbitMessage.RABBIT_COMMANDS.FROM_SHARDS.CONSTRUCT_DROPS:
                const userID = message.args.userID;
                const drops = message.args.drops;
                logCommandHandler("Handling request to construct " + drops.length + " drops for " + userID + ".");
                this.dropConstructor.constructDrops(drops, userID, () => {
                    this.scheduler.rabbitCommunicator.sendSaveItemsConfirmation(message);
                });
            break;
            default:
                throw "Unknown command received: " + message.command;
        }
    }
}

function logCommandHandler(s) {
    console.log("[RabbitCommandHandler] " + s);
}

module.exports = SchedulerRabbitCommandHandler;