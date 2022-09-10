const RabbitConnection = require("../../shared/rabbitConnection");
const MainLoop = require("./mainLoop");
const RabbitCommandHandler = require("./rabbit/schedulerRabbitCommandHandler");
const RabbitCommunicator = require("./rabbit/schedulerRabbitCommunicator");

class Scheduler {
    /**
     * 
     * @param {RabbitConnection} rabbitConnection 
     */
    constructor(rabbitConnection) {
        this.rabbitCommandHandler = new RabbitCommandHandler(this);
        this.rabbitCommunicator = new RabbitCommunicator(rabbitConnection, this.rabbitCommandHandler);
        this.mainLoop = new MainLoop(this);
    }

    startMainLoop() {
        this.mainLoop.start();
    }
}

module.exports = Scheduler;