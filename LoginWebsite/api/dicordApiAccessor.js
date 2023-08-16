const secret = require("../../DiscordBot/_SECRET.json");
const botConfig = require("../../config-example/discordbot-config.json");
const globalConfig = require("../../config-example/global-config.json");
const fetch = require("node-fetch");

class DiscordAPIAccessor {
    static API_ENDPOINT = 'https://discord.com/api/v10/';
    static API_TOKEN_URI = 'oauth2/token';
    static API_IDENTIFY_URI = 'oauth2/@me';
    static API_USERS_URI = "users";
    constructor(adressManager) {
        console.log("Constructing discord API Accessor");
        this.redirectUri = adressManager.getRedirectToAuthenticationUri();
    }

    /**
     * 
     * @param {string} code - one time code from discord.com to request token
     * @returns {Object} {data: discordData, token: token}
     */
    requestUserIdentifyData(code) {
        const promise = new Promise((resolve, reject) => {
            this._requestAuthToken(code).then((token) => {
                const getReqObject = this._getGetRequestObject(token);
                console.log("Get request: " + JSON.stringify(getReqObject));
                fetch(DiscordAPIAccessor.API_ENDPOINT + DiscordAPIAccessor.API_IDENTIFY_URI, getReqObject).then((res) => res.json()).then((json) => {
                    console.log("API user data received:");
                    console.log(json);
                    if (json.message !== undefined && json.message.startsWith("401")) {
                        console.error("401: Unauthorized, returning null");
                        resolve(null);
                    } else {
                        resolve({data: json.user, token: token});
                    }
                })
            });
        });
        return promise;
    }

    /**
     * check authenticated beforehand!
     * @param {*} userID 
     * @param {*} code 
     */
    requestJoinedFVGuilds(userID, code, accessToken) {
        return new Promise((resolve, reject) => {
            this._requestJoinedGuilds(userID, code, accessToken).then((json) => {
                resolve(json);
            }).catch(error => reject(error));
        });
    }

    fetchFVGuilds() {
        return this._sendGetRequestBotAuthed("users/@me/guilds");
    }

    getEmoteDataObjects(guildID) {
        return this._sendGetRequestBotAuthed("guilds/" + guildID + "/emojis");
    }

    // unused
    _getGuildObject(guildID) {
        return this._sendGetRequestBotAuthed("guilds/" + guildID);
    }

    _sendGetRequestBotAuthed(uri) {
        return new Promise((resolve, reject) => {
            const reqObj = {
                method: "get",
                headers: this._getBotAuthHeader()
            };
            fetch(DiscordAPIAccessor.API_ENDPOINT + uri, reqObj).then((res) => res.json()).then((json) => {
                resolve(json);
            }).catch(error => reject(error));
        });
    }

    _requestJoinedGuilds(userID, code, accessToken) {
        return new Promise((resolve, reject) => {
            const uri = this._getJoinedGuildsURI();
            const reqObject = this._getGetRequestObject(accessToken);
            console.log("Requesting user object for " + userID);
            fetch(uri, reqObject).then((res) => res.json()).then((json) => {
                console.log("Joined guilds data received for " + userID);
                resolve(json);
            }).catch(error => reject(error));
        })
    }

    _getBotAuthHeader() {
        const botToken = secret.token;
        return {
            Authorization: "Bot " + botToken
        }
    }

    _getGetRequestObject(token) {
        return {
            method: "get",
            headers: this._getAuthHeader(token)

        };
    }

    _getAuthHeader(token) {
        return {
            Authorization: "Bearer " + token
        };
    }

    _getJoinedGuildsURI() {
        return DiscordAPIAccessor.API_ENDPOINT + DiscordAPIAccessor.API_USERS_URI + "/@me/guilds";
    }

    _requestAuthToken(code) {
        const promise = new Promise((resolve, reject) => {
            const data = {
                'client_id': botConfig.clientID,         // always youse releaseAPP for auth!
                'client_secret': secret.client_secret,
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': this.redirectUri
            }
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            const dataAsUri = new URLSearchParams(data).toString();
            const discordAdress = DiscordAPIAccessor.API_ENDPOINT + DiscordAPIAccessor.API_TOKEN_URI;
            const postObject = {
                method: "post",
                body: dataAsUri,
                headers: headers
            };
            console.log("Postin: " + JSON.stringify(postObject));
            fetch(discordAdress, postObject).then((res) => res.json()).then((json) => {
                console.log("API data received:");
                console.log(json);
                resolve(json.access_token);
            })
        });
        return promise;
    }
}

module.exports = DiscordAPIAccessor;