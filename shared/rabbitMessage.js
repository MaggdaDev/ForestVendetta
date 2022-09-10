class RabbitMessage {
    //all the commands allowed to send via rabbit, sorted by emitter
    static RABBIT_COMANDS = {
        FROM_SCHEDULER: {                                    // all messages sent by scheduler
            SEND_TEST_MESSAGE: 'SEND_TEST_MESSAGE', // to discordbot
        },

        FROM_DISCORDBOT: {                                   // all messages sent by discordbot

        }
    }
    constructor(command, content) {
        if (!command) throw "Can't create message without command";
        this.command = command;
        this.conent = content;
    }
}

module.exports = RabbitMessage;