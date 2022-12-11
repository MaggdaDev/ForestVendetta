const secret = require("../../DiscordBot/_SECRET.json");
const botConfig = require("../../config-example/discordbot-config.json");
const fetch = require("node-fetch");

class DiscordAPIAccessor {
    static REDIRECT_URI = "http://minortom.net:2999/redirect.html";
    static TEST_REDIRECT_URI = "http://localhost:2999/redirect.html";
    static API_ENDPOINT = 'https://discord.com/api/v10/';
    static API_TOKEN_URI = 'oauth2/token';
    static API_IDENTIFY_URI = 'oauth2/@me';
    constructor() {
        console.log("Constructing discord API Accessor");
        if (botConfig.testMode) {
            this.redirectUri = DiscordAPIAccessor.TEST_REDIRECT_URI;
        } else {
            this.redirectUri = DiscordAPIAccessor.REDIRECT_URI;
        }
    }

    requestUserIdentifyData(token) {
        const promise = new Promise((resolve, reject) => {
            this.requestAuthToken(token).then((code) => {
                const headers = {
                    Authorization: "Bearer " + code
                };
                const getReqObject = {
                    method: "get",
                    headers: headers

                };
                console.log("Get request: " + JSON.stringify(getReqObject));
                fetch(DiscordAPIAccessor.API_ENDPOINT + DiscordAPIAccessor.API_IDENTIFY_URI, getReqObject).then((res) => res.json()).then((json) => {
                    console.log("API user data received:");
                    console.log(json);
                    if (json.message !== undefined && json.message.startsWith("401")) {
                        console.error("401: Unauthorized, returning null");
                        reject(json.message);
                    } else {
                        resolve(json.user);
                    }
                })
            });
        });
        return promise;
    }

    requestAuthToken(code) {
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