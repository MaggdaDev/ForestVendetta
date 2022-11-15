const BossSpawnedMessage = require("./DiscordMessages/bossSpawnedMessage");

class DiscordMessageSender {
    constructor(client) {
        this.client = client;
    }

    sendBossSpawnedMessage(channelID, displayName, adress) {
        this._sendToChannel(channelID, new BossSpawnedMessage(displayName, adress));
    }

    sendTestMessage(channelID) {
        this._sendToChannel(channelID, "ss");
    }

    _sendToChannel(channelID, message) {
        if (this.client.channels.cache.has(channelID)) {
            this.client.channels.cache.get(channelID).send(message);
        } else {
            throw "Channel '" + channelID + "' not loaded in cache! Can't send message '" + message + "'!";
        }
    }
}
function logDiscordMessageSender(s) {
    console.log("[DiscordMessageSender] " + s);
}
module.exports = DiscordMessageSender;