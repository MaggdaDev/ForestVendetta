const url = require("url");
const DiscordAPIAccessor = require("./dicordApiAccessor");
const RequestHandler = require("./requestHandler");
class FVAPI {
    static API_URI = "/api/";

    static API_REQUESTS = {     // lower case all
        joinGameData: "joingamedata"
    }

    constructor() {
        console.log("API constructed");
        this.discordApiAccessor = new DiscordAPIAccessor();
        this.requestHandler = new RequestHandler(this.discordApiAccessor);

    }

    apiRequestListenerHandler(req, res) {
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
    }

    routeRequest(path, query) {
        const promise = new Promise((resolve, reject) => {
            console.log("Routing request: " + path);
            switch (path.toLowerCase()) {
                case FVAPI.API_REQUESTS.joinGameData:       // data before joining game
                    this.requestHandler.requestJoinGameData(query).then((res) => resolve(res));
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