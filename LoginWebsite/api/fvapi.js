const url = require("url");
const LoginMongoAccessor = require("../mongo/loginMongoAccessor");
const LoginRabbitCommunicator = require("../rabbit/loginRabbitCommunicator");
const DiscordAPIAccessor = require("./dicordApiAccessor");
const DiscordAuthenticator = require("./discordAuthenticator");
const RequestHandler = require("./requestHandler");
const DiscordEmoteImporter = require("./discordEmoteImporter");
const { error, log } = require("console");
class FVAPI {
    static API_URI = "/api/";

    static API_REQUESTS = {     // lower case all
        requestDiscordAuth: "requestdiscordauth",
        getProfileData: "getprofiledata",       // request user profile data before joining a game
        deployToGameIfPossible: "deploytogameifpossible",
        getAdressConfig: "getadressconfig",
        getJoinedFVGuilds: "getjointfvguilds",
        getEmotes: "getemotes",
        addEmote: "addemote",
        removeEmote: "removeemote"
    }

    /**
     * 
     * @param {LoginMongoAccessor} mongoAccessor 
     * @param {LoginRabbitCommunicator} rabbitCommunicator
     */
    constructor(mongoAccessor, rabbitCommunicator, adressManager) {
        logApi("API constructed");
        this.rabbitCommunicator = rabbitCommunicator;
        this.adressManager = adressManager;
        this.discordApiAccessor = new DiscordAPIAccessor(adressManager);
        this.discordAuthenticator = new DiscordAuthenticator(this.discordApiAccessor);
        this.requestHandler = new RequestHandler(this.discordApiAccessor, this.discordAuthenticator, mongoAccessor, this.rabbitCommunicator, adressManager);
        this.discordEmoteImporter = new DiscordEmoteImporter(this.discordApiAccessor, this.discordAuthenticator);
    }

    apiRequestListenerHandler(req, res) {
        try {
            logApi("API request received!");
            const reqUrl = req.url;
            const parsed = url.parse(reqUrl, true);
            const pathName = parsed.pathname;
            if (pathName.length < 6) {       // every starting with /api/
                this.logInvalid(pathName);
                return;
            }
            const withoutAPI = pathName.substring(5);
            const query = parsed.query;
            this.handleRequest(withoutAPI, query, res).catch((e) => {
                if (e.redirect !== "undefined") {
                    res.status(302);
                    return res.send(e.redirect);
                }
                else { throw e }
            });
        } catch (e) {
            console.error(e);
            res.send(e);
        }
    }

    handleRequest(path, query, expressRes) {
        const instance = this;
        const promise = new Promise((resolve, reject) => {
            logApi("Routing request: " + path);
            try {
                switch (path.toLowerCase()) {
                    case FVAPI.API_REQUESTS.requestDiscordAuth:     // expected args: code and gameID
                        logApi("Received request for discord auth");
                        this.requestHandler.requestDiscordAuth(query).then((userID) => {
                            const redirectAdress = this.adressManager.createRedirectToPrepareUri(userID, query.code, query.gameID);
                            logApi("User authenticated. Redirecting to prepare page.");
                            expressRes.status(302);
                            return expressRes.send(redirectAdress);
                        }).catch((clientRedirectRes) => {
                            logApi("API calls failed! Sending error redirect to client: " + JSON.stringify(clientRedirectRes));
                            reject(clientRedirectRes);
                        })
                        break;
                    case FVAPI.API_REQUESTS.getProfileData:       // data before joining game
                        this.requestHandler.getProfileData(query).then((res) => {
                            logApi("Retrieved join game data: " + res);
                            expressRes.send(res);
                        }).catch((clientRedirectRes) => {
                            logApi("API calls failed! Sending error redirect to client:");
                            reject(clientRedirectRes);
                        });
                        return;

                    case FVAPI.API_REQUESTS.deployToGameIfPossible:
                        logApi("-----------DeployToGameIfPossible:");
                        this.requestHandler.deployToGameIfPossible(query).then((res) => {
                            logApi("Handling deploy request finished! Returning to client: " + res);
                            expressRes.send(res);
                        });
                        break;
                    case FVAPI.API_REQUESTS.getAdressConfig:
                        logApi("Get adress config");
                        expressRes.send(this.adressManager.getAdressConfig());
                        break;
                    case FVAPI.API_REQUESTS.getJoinedFVGuilds:
                        logApi("Requested list of FV guilds");
                        this.discordEmoteImporter.getFVGuildList(query).then((res) => {
                            logApi("Returning back to client list of joint FV guilds (" + res.length + ")");
                            expressRes.send(res);
                        }).catch(error => {
                            reject(this.requestHandler.getRejectObject(error));
                        });
                        break;
                    case FVAPI.API_REQUESTS.getEmotes:
                        logApi("requested emotes for guild id");
                        this.discordEmoteImporter.getGuildEmotes(query).then((res) => {
                            logApi("Returning list of emotes to client");
                            expressRes.send(res);
                        }).catch(error => {
                            reject(this.requestHandler.getRejectObject(error));
                        });
                        break;
                    case FVAPI.API_REQUESTS.addEmote:
                        logApi("requested add emote");
                        this.requestHandler.addEmote(query).then((res) => {
                            logApi("Add emote successful.");
                            expressRes.send();
                        }).catch(error => {
                            reject(this.requestHandler.getRejectObject(error));
                        });
                        break;
                    case FVAPI.API_REQUESTS.removeEmote:
                        logApi("requested remove emote");
                        this.requestHandler.removeEmote(query).then((res) => {
                            logApi("Remove emote successful.");
                            expressRes.send();
                        }).catch(error => {
                            reject(this.requestHandler.getRejectObject(error));
                        });
                        break;
                    default:
                        this.logInvalid(path);
                        reject("invalid request");
                        break;
                }
            } catch (error) {
                console.error(error);
            }
        });
        return promise;
    }

    logInvalid(pathName) {
        logApi("Invalid api request: " + pathName);
    }


}
function logApi(s) {
    console.log("[FVAPI] " + s);
}

module.exports = FVAPI;