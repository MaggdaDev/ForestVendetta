class JoinGameBtn {

    /**
     * 
     * @param {string} code - discord code from site load cause its used as unique key at fvapi
     * @param {HttpCommunicator} httpCommunicator
     */
    constructor(code, gameID, httpCommunicator) {
        logJoinGameBtn("Constructing join game button");
        this.code = code;
        this.gameID = gameID;
        this.httpCommunicator = httpCommunicator;
        this.resolveUserIDPromiseJoinGame;
        this.alreadyFired = false;
        this.userIDForJoinGamePromise = new Promise((resolve, rej) => {
            if (userID !== null) {
                resolve(userID);
                return;
            }
            this.resolveUserIDPromiseJoinGame = resolve;
        });

        
    }

    resolvePromise(userID) {    // PLEASE but this when client received user ID from auth process API side
        this.resolveUserIDPromiseJoinGame(userID);
    }

    onClick() {
        logJoinGameBtn("Click!");
        this.userIDForJoinGamePromise.then((userID)=> {
            if(this.alreadyFired) {
                logJoinGameBtn("BUTTON ALREADY FIRED!!!");
                this.alreadyFired = true;
                return;
            }
            this.alreadyFired = true;
            logJoinGameBtn("Retrieved user ID for join game call: "+ userID);
            this.httpCommunicator.requestJoinGame(this.code, userID, this.gameID, ((response) => {
                console.log("Got response to join game request: " + response);
                window.location.replace(response);
            }));
        })
    }


}

function logJoinGameBtn(s) {
    console.log("[JoinGameBtn] " + s);
}