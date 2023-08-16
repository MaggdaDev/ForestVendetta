const DiscordAPIAccessor = require("./dicordApiAccessor");
const RequestHandler = require("./requestHandler");

class DiscordAuthenticator {

    /**
     * 
     * @param {DiscordAPIAccessor} discordAPIAccessor 
     */
    constructor(discordAPIAccessor) {
        this.authMap = new Map();
        this.discordAPIAccessor = discordAPIAccessor;
    }

    authenticateUser(code) {
        return new Promise((resolve,reject) => {
            this.discordAPIAccessor.requestUserIdentifyData(code).then((apiData)=> {
                const profileData = apiData.data;
                const token = apiData.token;
                logAuth("Received discord data!");
                if (profileData === null || profileData === undefined) {
                    console.log("Received discord data is null, rejecting...");
                    reject();
                    return;
                }
                this.saveUserToAuthMap(profileData, code, token);
                resolve(profileData);
            }).catch((e) => reject(e));
        });
        
    }

    /**
     * 
     * @param {Object} discordData 
     * @param {string} discordData.id
     * @param {string} discordData.
     */
    saveUserToAuthMap(discordData, code, token) {
        const authObject = {
            code: code,
            discordAPIdata: discordData,
            token: token
        };
        const id = discordData.id;
        logAuth("Writing " + id + " with code " + code + " into auth map.");
        this.authMap.set(id, authObject);
        logAuth("Auth map is now: " + this.authMap.entries.toString());
        
    }

    /**
     * @description check if userID with right code is inside auth map
     * 
     */
    isAuthenticated(userID, code) {
        if(this.authMap.has(userID) && this.authMap.get(userID).code === code) {
            return true;
        } else {
            return false;
        }
    }

    getProfileData(userID, code) {
        if(this.isAuthenticated(userID, code)) {
            return this.authMap.get(userID).discordAPIdata;
        } else {
            throw RequestHandler.ERRORS.NOT_AUTHENTICATED;
        }
    }

    getAccessToken(userID, code) {
        if(this.isAuthenticated(userID, code)) {
            return this.authMap.get(userID).token;
        } else {
            throw RequestHandler.ERRORS.NOT_AUTHENTICATED;
        }
    } 

}

function logAuth(s) {
    console.log("[DiscordAuthenticator] " + s);
}

module.exports = DiscordAuthenticator;