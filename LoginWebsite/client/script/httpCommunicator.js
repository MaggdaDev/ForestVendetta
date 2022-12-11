class HTTPCommunicator {
    static API_URI = "/api/";

    static JOIN_GAME_DATA_REQUEST = "joingamedata";
    constructor(host) {
        this.adress = host + HTTPCommunicator.API_URI;
        this.userID = null;
    }

    requestProfileDataAsync(code, callback) {
        var apiSubAdress = HTTPCommunicator.JOIN_GAME_DATA_REQUEST;
        // params
        apiSubAdress += "?";
        // code
        apiSubAdress += "code=" + code;
        // userID
        if (this.userID !== null && this.userID !== undefined) {
            apiSubAdress += "&userid=" + this.userID;
        }
        this.getAsync(apiSubAdress, callback);
    }

    setUserID(userID) {
        if (userID !== null && userID !== undefined) {
            consnole.log("Setting userID in http communicator: " + this.userID);
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