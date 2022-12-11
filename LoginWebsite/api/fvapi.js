const url = require("url");
const LoginMongoAccessor = require("../mongo/loginMongoAccessor");
const DiscordAPIAccessor = require("./dicordApiAccessor");
const RequestHandler = require("./requestHandler");
class FVAPI {
    static API_URI = "/api/";

    static API_REQUESTS = {     // lower case all
        joinGameData: "joingamedata"
    }

    /**
     * 
     * @param {LoginMongoAccessor} mongoAccessor 
     */
    constructor(mongoAccessor, adressManager) {
        console.log("API constructed");
        this.adressManager = adressManager;
        this.discordApiAccessor = new DiscordAPIAccessor();
        this.requestHandler = new RequestHandler(this.discordApiAccessor, mongoAccessor, adressManager);
        this.authMap = new Map();

    }

    apiRequestListenerHandler(req, res) {
        try {
            console.log("API request received!");
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
        const promise = new Promise((resolve, reject) => {
            console.log("Routing request: " + path);
            switch (path.toLowerCase()) {
                case FVAPI.API_REQUESTS.joinGameData:       // data before joining game
                    this.requestHandler.requestJoinGameData(query).then((res) => {
                        console.log("Retrieved join game data: " + res);
                        const code = query.code;
                        const userID = res.discordAPI.id;
                        this.authMap.set("userID", code);
                        console.log("Now matching code (" + code + ") and userID (" + userID + ") to auth hash map.");
                        console.log("Auth map is now: " + this.authMap.entries.toString());
                        resolve(res);
                    }).catch((clientRedirectRes)=> {
                        console.log("API calls failed! Sending error redirect to client");
                        resolve(clientRedirectRes);
                    });
                    return;

                default:
                    this.logInvalid(path);
                    reject();
                    break;
            }
        });
        return promise;
    }

    logInvalid(pathName) {
        console.log("Invalid api request: " + pathName);
    }
}

module.exports = FVAPI;