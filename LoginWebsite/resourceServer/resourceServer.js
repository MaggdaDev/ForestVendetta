const ResourceLoader = require('./resourceLoader');
const url = require("url");

/**
 * @description serving resources in JSON of MAP of BASE64 encoded files from remote directories with filename without extension as key
 */
class ResourceServer {
    static RESOURCE_SERVER_URI = "/resources/";

    constructor() {
        this.loader = new ResourceLoader();

        // load for redirect page
        this.weaponImagesBase64json = this.loader.loadWeaponImages();
        this.inventoryHTMLsParamObject = this.loader.loadInventoryHTMLs();
    }

    handleResourceRequest(req, res) {
        try {
            logResourceServer("Resource request received!");
            const reqUrl = req.url;
            const parsed = url.parse(reqUrl, true);
            const pathName = parsed.pathname;
            if (pathName.length < ResourceServer.RESOURCE_SERVER_URI.length) {       // every starting with /api/
                this.logResourceServer("INVALID (not enough characters): " + pathName);
                return;
            }
            const withoutResourceUri = pathName.substring(ResourceServer.RESOURCE_SERVER_URI.length);
            const query = parsed.query;
            this.findRequestedParamObject(withoutResourceUri, query).then((result) => {
                logResourceServer("Sending response to client")
                res.send(result);
            });
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 
     * @param {string} withoutResourceUri - command name
     * @param {Object} query - ?key=value&key2=value2 as object
     * @returns {string} json of map of base64 encoded files; filename without extension as key
     */
    async findRequestedParamObject(withoutResourceUri, query) {
        switch (withoutResourceUri.toLowerCase()) {
            case "getweaponimages":
                logResourceServer("Weapon images requested!");
                return this.weaponImagesBase64json;
            default:
                logResourceServer("Invalid request received: " + withoutResourceUri);
                break;
        }
    }

}

function logResourceServer(s) {
    console.log("[ResourceServer] " + s);
}

module.exports = ResourceServer;