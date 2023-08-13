class HTTPCommunicator {
    static API_URI = "/api/";
    static RESOURCE_SERVER_URI = "/resources/";

    // api
    static REQUEST_DISCORD_AUTH = "requestdiscordauth"; // from wait for auth site; expecting redirect as response
    static GET_PROFILE_DATA_REQUEST = "getprofiledata";
    static JOIN_GAME_REQUEST = "deployToGameIfPossible";

    // resources (always in json of map of base64 encoded; filename without extension as key)
    static GET_WEAPON_IMAGES = "getweaponimages";
    static GET_INVENTORY_HTML = "getinventoryhtml";
    static GET_INGAME_UI_CSS = "getingameuicss";
    static GET_ITEM_CONFIG = "getitemconfig";



    constructor(host, userID) {
        this.adress = host;
        this.userID = userID;
    }


    // requests to api start
    requestDiscordAccessAndRedirect(code, gameID) {
        var requestParams = [{ name: "code", value: code }, { name: "gameID", value: gameID }];
        if (!(code && gameID)) {
            console.error("Not all required for auth given! Code: " + code + " gameID:" + gameID);
            return;
        }
        const apiSubAdress = HTTPCommunicator._generateSubadress(HTTPCommunicator.REQUEST_DISCORD_AUTH, requestParams);
        this._getAsync(HTTPCommunicator.API_URI, apiSubAdress);
    }

    requestJoinGame(code, userID, gameID, hotbarIDsList, armorBarIDsList, callback) {
        if (!(code && userID && gameID)) {
            console.error("Not all required for join game given! Code: " + code + " userID: " + userID + " gameID:" + gameID);
            return;
        }
        const args = [{ name: "code", value: code }, { name: "userID", value: userID }, { name: "gameID", value: gameID }].concat(hotbarIDsList).concat(armorBarIDsList);
        var apiSubAdress = HTTPCommunicator._generateSubadress(HTTPCommunicator.JOIN_GAME_REQUEST, args);
        this._getAsync(HTTPCommunicator.API_URI, apiSubAdress, callback);
    }



    requestProfileData(userID, code, callback) {
        var requestParams = [{ name: "userID", value: userID }, { name: "code", value: code }];
        if (this.userID !== null && this.userID !== undefined) {
            requestParams.push({ name: "userid", value: this.userID });
        }
        const apiSubAdress = HTTPCommunicator._generateSubadress(HTTPCommunicator.GET_PROFILE_DATA_REQUEST, requestParams);
        this._getAsync(HTTPCommunicator.API_URI, apiSubAdress, callback);
    }
    // requests to api end


    //requests to resources start
    requestWeaponImages(callback) {
        logHTTPCommunicator("Requesting weapon images...");
        const subAdress = HTTPCommunicator._generateSubadress(HTTPCommunicator.GET_WEAPON_IMAGES);
        this._requestResource(subAdress, callback);
    }

    requestInventoryHTML(callback) {
        logHTTPCommunicator("Requesting inventory html...");
        const subAdress = HTTPCommunicator._generateSubadress(HTTPCommunicator.GET_INVENTORY_HTML);
        this._requestResource(subAdress, callback);
    }

    requestIngameUICSS(callback) {
        logHTTPCommunicator("Requesting ingame ui css...");
        const subAdress = HTTPCommunicator._generateSubadress(HTTPCommunicator.GET_INGAME_UI_CSS);
        this._requestResource(subAdress, callback);
    }

    requestItemConfig(callback) {
        logHTTPCommunicator("Requesting item config...");
        const subAdress = HTTPCommunicator._generateSubadress(HTTPCommunicator.GET_ITEM_CONFIG);
        this._requestResource(subAdress, callback);
    }
    // requests to resources end

    // internal
    /**
         * @description currently: just add params if existing
         * @param {string} commandSubAdress 
         * @param {Object[]} params - [{name: , value: }]
         */
    static _generateSubadress(commandSubAdress, params) {
        var subAdress = commandSubAdress;
        if (params !== null && params !== undefined && params.length > 0) {

            subAdress += "?";
            params.forEach((curr, index) => {
                subAdress += curr.name + "=" + curr.value;
                if (index < params.length - 1) {
                    subAdress += "&";
                }
            });
        }

        logHTTPCommunicator("Subadress created: " + subAdress);
        return subAdress;
    }

    /**
     * 
     * @param {string} subAdress command to request data as map
     * @param {function} callback function that takes map as arg
     */
    _requestResource(subAdress, callback) {
        this._getAsync(HTTPCommunicator.RESOURCE_SERVER_URI, subAdress, (response) => {
            logHTTPCommunicator("Response to resource request received. Now casting to map...");
            const obj = JSON.parse(response);
            const map = new Map(Object.entries(obj));
            logHTTPCommunicator("Casting complete. Now calling callback...");
            callback(map);
        });
    }

    /**
     * 
     * @param {string} subServer - api or resources? User HTTPCommunicator.API_URI or similar
     * @param {string} subAdress - command and params created with _generateSubadress
     * @param {function()} callback 
     */
    _getAsync(subServer, subAdress, callback,) { // copy pesto https://stackoverflow.com/questions/247483/http-get-request-in-javascript
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                logHTTPCommunicator("status 200 received. Callback.");
                if (callback !== undefined && callback !== null) {
                    callback(xmlHttp.responseText);
                } else {
                    logHTTPCommunicator("Callback is not existent.");
                }
            } else if (xmlHttp.readyState == 4 && xmlHttp.status == 302) {
                logHTTPCommunicator("status 302 received. Redirecting to " + xmlHttp.responseText);
                return window.location.replace(xmlHttp.responseText);
            }
        }
        xmlHttp.open("GET", location.protocol + "//" + this.adress + subServer + subAdress, true); // true for asynchronous 
        xmlHttp.send(null);
        logHTTPCommunicator("Sent http request: " + subAdress);
    }
}
function logHTTPCommunicator(s) {
    console.log("[HTTPCommunicator] " + s);
}