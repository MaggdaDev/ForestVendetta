const url = require("url");
const LoginMongoAccessor = require("../mongo/loginMongoAccessor");
const LoginRabbitCommunicator = require("../rabbit/loginRabbitCommunicator");
const DiscordAPIAccessor = require("./dicordApiAccessor");
const RequestHandler = require("./requestHandler");
class FVAPI {
    static API_URI = "/api/";

    static API_REQUESTS = {     // lower case all
        joinGameData: "joingamedata",       // request user profile data before joining a game
        deployToGameIfPossible: "deploytogameifpossible"   
    }

    /**
     * 
     * @param {LoginMongoAccessor} mongoAccessor 
     * @param {LoginRabbitCommunicator} rabbitCommunicator
     */
    constructor(mongoAccessor, rabbitCommunicator, adressManager) {
        logApi("API constructed");
        this.rabbitCommunicator = rabbitCommunicator;
        this.authMap = new Map();       // DO NOT re-construct, request handler is using this object
        this.adressManager = adressManager;
        this.discordApiAccessor = new DiscordAPIAccessor();
        this.requestHandler = new RequestHandler(this.discordApiAccessor, mongoAccessor, this.rabbitCommunicator, adressManager, this.authMap);
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
            this.routeRequest(withoutAPI, query).then((result) => {
                res.send(result);
            });
        } catch (e) {
            console.error(e);
        }
    }

    routeRequest(path, query) {
        const instance = this;
        const promise = new Promise((resolve, reject) => {
            logApi("Routing request: " + path);
            switch (path.toLowerCase()) {
                case FVAPI.API_REQUESTS.joinGameData:       // data before joining game
                    this.requestHandler.requestJoinGameData(query).then((res) => {
                        res.code = query.code;
                        logApi("Retrieved join game data: " + res);
                        const userID = res.discordAPI.id;
                        instance.authMap.set(userID, res);
                        logApi("Now matching res with code (" + res.code + ") and userID (" + userID + ") to auth hash map.");
                        logApi("Auth map is now: " + this.authMap.entries.toString());
                        resolve(res);
                    }).catch((clientRedirectRes)=> {
                        logApi("API calls failed! Sending error redirect to client");
                        resolve(clientRedirectRes);
                    });
                    return;

                case FVAPI.API_REQUESTS.deployToGameIfPossible:
                    this.requestHandler.deployToGameIfPossible(query).then((res) => {
                        logApi("Handling deploy request finished! Returning to client: " + res);
                        resolve(res);
                    });
                    break;
                default:
                    this.logInvalid(path);
                    reject("invalid request");
                    break;
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