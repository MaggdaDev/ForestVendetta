class AdressManager {
    constructor(isTestMode) {
        if(isTestMode) {
            this.adressConfig = require("../config-example/adresses-test-config.json");
        } else {
            this.adressConfig = require("../config-example/adresses-config.json");
        }

        if(this.adressConfig === undefined || this.adressConfig === null) throw "Invalid configuration!";
        
        this.baseAdress = this.adressConfig["login-website-adress"];
        console.log("Created new AdressManager with baseAdress: " + this.baseAdress);
    }

    getAdressConfig() {
        return this.adressConfig;
    }

    getErrorURL(params) {
        var ret = this.adressConfig["error-redirect-full-adress"];
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