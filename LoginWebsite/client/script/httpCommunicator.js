class HTTPCommunicator {
    static API_URI = "/api/";

    static JOIN_GAME_DATA_REQUEST = "joingamedata";
    constructor(host) {
        this.adress = host + HTTPCommunicator.API_URI;
    }

    requestProfileDataAsync(code, callback) {
        this.getAsync(HTTPCommunicator.JOIN_GAME_DATA_REQUEST + "?code=" + code, callback);
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