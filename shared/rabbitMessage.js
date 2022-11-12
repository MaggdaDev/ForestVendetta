class RabbitMessage {
    //all the commands allowed to send via rabbit, sorted by emitter
    static RABBIT_COMMANDS = {
        FROM_SCHEDULER: {                                           // all messages sent by scheduler
            SEND_TEST_MESSAGE: 'SEND_TEST_MESSAGE',             // to discordbot
            SEND_SPAWN_BOSS_MESSAGE: 'SEND_SPAWN_BOSS_MESSAGE', // to discordbot; args: displayName, channelID

            CREATE_SHARD: 'CREATE_SHARD'                            // to shard manager; args: port
        },

        FROM_DISCORDBOT: {                                          // all messages sent by discordbot

        }
    }

    /**
     * 
     * @param {string} command - PLEASE USE RabbitMessage.RABBIT_COMMANDS!
     * @param {Object} args - optional
     */
    constructor(command, args) {
        if (!command) throw "Can't create message without command";
        this.command = command;
        this.args = args;
    }
}

module.exports = RabbitMessage;