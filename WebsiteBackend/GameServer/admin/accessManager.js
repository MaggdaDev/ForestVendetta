require('../mainLoop');
class AccessManager {
    static REJECT_REASONS =  {
        ALREADY_IN_MATCH: "ALREADY_IN_MATCH",
        LEVEL_TOO_LOW: "LEVEL_TOO_LOW",
        MATCH_FULL: "MATCH_FULL"
    }
    static MAX_PLAYERS = 10;
    static MIN_LVL = 1;
    /**
     * 
     * @param {MainLoop} mainLoop 
     */
    constructor(players) {
        this.maxPlayers = AccessManager.MAX_PLAYERS;
        this.minLvl = AccessManager.minLvl;
        this.players = players;
    }

    //main
    /**
     * 
     * @param {Object} playerData 
     * @param {Object} playerData.discordAPI
     * @param {Object} playerData.mongo
     */
    mayJoin(playerData) {
        const errorObject = {status: 0};
        const id = playerData.discordAPI.id;
        
        if(this.players.has(id)) {
            errorObject.error = AccessManager.REJECT_REASONS.ALREADY_IN_MATCH;
            return errorObject;
        }


        return {status:1};  // may join!
    }
}

module.exports = AccessManager;