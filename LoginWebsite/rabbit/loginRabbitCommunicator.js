const RabbitConnection = require("../../shared/rabbitConnection");
const RabbitMessage = require("../../shared/rabbitMessage");

class LoginRabbitCommunicator {
     /**
     * @param {RabbitConnection} rabbitConnection
     */
      constructor(rabbitConnection) {
        this.rabbitConnection = rabbitConnection;
        this.rabbitConnection.onMessageToLoginWebsite((message)=>this.handleMessage(message));
    }

    /**
     * 
     * @param {string} gameID 
     * @param {objet} playerData 
     * @param {function(message)} callback 
     */
    deployToGameIfPossibleAndHandleReply(gameID, playerData, callback) {
        this.rabbitConnection.sendToQueueAndHandleReply(gameID, new RabbitMessage(RabbitMessage.RABBIT_COMMANDS.FROM_LOGIN_WEBSITE.DEPLOY_TO_GAME_IF_POSSIBLE, {playerData: playerData}), callback);
    }

    handleMessage(message) {

    }
}

module.exports = LoginRabbitCommunicator;