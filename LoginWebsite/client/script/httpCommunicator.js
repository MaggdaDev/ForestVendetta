class HTTPCommunicator {
    static API_URI = "/api/";

    static JOIN_GAME_DATA_REQUEST = "joingamedata";
    static JOIN_GAME_REQUEST = "deployToGameIfPossible";

    /**
     * 
     * @param {string} commandSubAdress 
     * @param {Object[]} params - [{name: , value: }]
     */
    static generateApiSubadress(commandSubAdress, params) {
        var apiSubAdress = commandSubAdress;
        if(params !== null && params !== undefined) {

            apiSubAdress += "?";
            params.forEach((curr, index) => {
                apiSubAdress += curr.name + "=" + curr.value;
                if(index < params.length-1) {
                    apiSubAdress += "&";
                }
            });
        }

        console.log("API subadress created: " + apiSubAdress);
        return apiSubAdress;
    }
    constructor(host) {
        this.adress = host + HTTPCommunicator.API_URI;
        this.userID = null;
    }

    requestJoinGame(code, userID, gameID, callback) {
        if(!(code && userID && gameID)) {
            console.error("Not all required for join game given! Code: " + code + " userID: " + userID + " gameID:" + gameID);
            return;
        }
        var apiSubAdress = HTTPCommunicator.generateApiSubadress(HTTPCommunicator.JOIN_GAME_REQUEST, [{name: "code", value: code}, {name: "userID", value: userID}, {name: "gameID", value: gameID}]);
        this.getAsync(apiSubAdress, callback);
    }

    requestProfileDataAsync(code, callback) {
        var requestParams = [{name:"code", value:code}];
        if (this.userID !== null && this.userID !== undefined) {
            requestParams.push({name:"userid", value: this.userID});
        }
        const apiSubAdress = HTTPCommunicator.generateApiSubadress(HTTPCommunicator.JOIN_GAME_DATA_REQUEST, requestParams);
        this.getAsync(apiSubAdress, callback);
    }

    setUserID(userID) {
        if (userID !== null && userID !== undefined) {
            console.log("Setting userID in http communicator: " + this.userID);
            this.userID = userID;
        } else {
            console.error("Trying to set null/undef userID in http communicator");
        }
    }


    getAsync(apiRequestUri, callback) { // copy pesto https://stackoverflow.com/questions/247483/http-get-request-in-javascript
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                callback(xmlHttp.responseText);
            }
        }
        xmlHttp.open("GET", "http://" + this.adress + apiRequestUri, true); // true for asynchronous 
        xmlHttp.send(null);
        console.log("Sent http request: " + apiRequestUri);
    }
}