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
        var ret = this.adressConfig["redirect-home"] + this.adressConfig["index-sub"];
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

    /**
     * 
     * @returns the flat adress redirecting to prepare after discord auth
     */
    getRedirectToPrepareUri() {
        return this.adressConfig["redirect-home"] + this.adressConfig["prepare-sub"];
    }

    getRedirectToAuthenticationUri() {
        return this.adressConfig["redirect-home"] + this.adressConfig["authentication-sub"];
    }

    /**
     * 
     * @param {*} userID 
     * @param {*} code 
     * @param {*} gameID 
     * @returns the redirecting adress to prepare including userID, code and gameID as query strings
     */
    createRedirectToPrepareUri(userID, code, gameID) {
        return this.getRedirectToPrepareUri() + `?userID=${userID}&code=${code}&state=${gameID}`;
    }
}

module.exports = AdressManager;