class RabbitMessage {
    //all the commands allowed to send via rabbit, sorted by emitter
    static RABBIT_COMMANDS = {
        FROM_SCHEDULER: {                                           // all messages sent by scheduler
            SEND_TEST_MESSAGE: 'SEND_TEST_MESSAGE',             // to discordbot
            SEND_SPAWN_BOSS_MESSAGE: 'SEND_SPAWN_BOSS_MESSAGE', // to discordbot; args: displayName, channelID, gameID

            CREATE_SHARD: 'CREATE_SHARD'                            // to shard manager; args: port
        },

        FROM_DISCORDBOT: {                                          // all messages sent by discordbot

        },

        GLOBAL: {
            _REPLY: "REPLY"
        },

        FROM_LOGIN_WEBSITE: {
            DEPLOY_TO_GAME_IF_POSSIBLE: "DEPLOY_TO_GAME_IF_POSSIBLE"  // to certain shard; args: playerData {code:, mongo:, discordAPI:}; awaits reply: {status: 0/1, shardUri: shardAdress:port?pw=123, error:}
        },

        FROM_SHARDS: {
            CONSTRUCT_DROPS: "CONSTRUCT_DROPS"                      // to scheduler; args: userID, {DropObject[]} drops, shardQueue 
        }
    }

    /**
     * 
     * @param {string} command - PLEASE USE RabbitMessage.RABBIT_COMMANDS!
     * @param {Object} args - optional
     */
    constructor(command, args, _optionalCorrelationID) {
        if (!command) throw "Can't create message without command";
        this.command = command;
        this.args = args;
        this.correlationID = _optionalCorrelationID;
    }

    static fromCorrelationID(id, args) {
        const mess = new RabbitMessage(RabbitMessage.RABBIT_COMMANDS.GLOBAL._REPLY, args, id);
        return mess;
    }
}

module.exports = RabbitMessage;