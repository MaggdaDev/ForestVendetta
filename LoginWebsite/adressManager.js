class AdressManager {
    constructor(baseAdress) {
        console.log("Created new AdressManager with baseAdress: " + baseAdress);
        this.baseAdress = baseAdress;
    }

    getIndexURL(params) {
        var ret = this.baseAdress + "/index.html";
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
}

module.exports = AdressManager;