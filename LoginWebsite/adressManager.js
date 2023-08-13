class AdressManager {
    constructor(isTestMode) {
        this.adressConfig = require("../config-example/adresses-config.json");
        if(this.adressConfig === undefined || this.adressConfig === null) throw "Invalid configuration!";

        if(isTestMode) {
            this.baseAdress = this.adressConfig["test-mode-login-website-adress"];
        } else {
            this.baseAdress = this.adressConfig["login-website-adress"];
        }

        
        console.log("Created new AdressManager with baseAdress: " + this.baseAdress);

    }

    getIndexURL(params) {
        var ret = this.baseAdress + this.adressConfig["index-sub"];
        if(params !==  undefined) {
            ret +="?";
            for (var prop in params) {
                if (Object.prototype.hasOwnProperty.call(params, prop)) {
                    ret += prop + "=" + params[prop] + "&";
                }
            }
        }
        return ret;
    }


    createRedirectToPrepareUri(userID, code, gameID) {
        return this.baseAdress + this.adressConfig["redirect-to-prepare-sub"] + `?userID=${userID}&code=${code}&state=${gameID}`;
    }
}

module.exports = AdressManager;