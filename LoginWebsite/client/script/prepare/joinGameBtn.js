class JoinGameBtn {

    /**
     * 
     * @param {string} code - discord code from site load cause its used as unique key at fvapi
     * @param {HttpCommunicator} httpCommunicator
     */
    constructor(userID, code, gameID, httpCommunicator, errorInfo) {
        logJoinGameBtn("Constructing join game button");
        this.code = code;
        this.gameID = gameID;
        this.errorInfo = errorInfo;
        this.httpCommunicator = httpCommunicator;
        this.resolveUserIDPromiseJoinGame;
        this.alreadyFired = false;
        this.userID = userID;


    }

    onClick() {
        logJoinGameBtn("Click!");
            if (this.alreadyFired) {
                logJoinGameBtn("BUTTON ALREADY FIRED!!!");
                this.alreadyFired = true;
                return;
            }
            this.alreadyFired = true;
            logJoinGameBtn("Retrieved user ID for join game call: " + this.userID);
            this.httpCommunicator.requestJoinGame(this.code, this.userID, this.gameID, hotbar.toURLParamObjetList(), ((accessObject) => {
                accessObject = JSON.parse(accessObject);
                console.log("Got response to join game request: " + accessObject);
                if (accessObject.status === 1) {
                    console.log("Success in requesting! Now redirecting to game");
                    window.location.replace(accessObject.shardUri);
                } else {
                    console.log("Failure! Status: " + accessObject.status + " with error: " + accessObject.error);
                    this.errorInfo.showError(accessObject.error);
                }

            }));
        
    }


}

function logJoinGameBtn(s) {
    console.log("[JoinGameBtn] " + s);
}