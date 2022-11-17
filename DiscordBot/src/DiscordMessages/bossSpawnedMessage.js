const LoginServer = require("../../../LoginWebsite/loginServer");
const ForestScout = require("../forestScout");

class BossSpawnedMessage {
    constructor(displayName, gameID, testMode) {
        var adress = "http://";
        if(testMode) {
            adress += LoginServer.LOCALHOST;
        } else {
            adress += LoginServer.HOST;
        }
        adress += ":" + LoginServer.PORT + "/" + LoginServer.LOGINPAGE;
        adress += "?game=" + gameID;
        this.content = "A " + displayName + " has appeared! Click here to fight it: " + adress;
    
    }
}

module.exports = BossSpawnedMessage;