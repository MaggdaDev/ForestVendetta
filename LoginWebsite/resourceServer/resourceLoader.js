const fs = require('node:fs');
const path = require('path');
class ResourceLoader {
    static WEAPONS_DIR_PATH = "../WebsiteBackend/GameClient/images/weapons";
    static INVENTORY_HTMLS_PATH = "../WebsiteBackend/GameClient/html/inventory/"

    /**
     * 
     * @returns {URLSearchParams} weapon images as form data
     */
    loadWeaponImages() {
        const retJson = this._loadFilesFromDirBase64json(ResourceLoader.WEAPONS_DIR_PATH);
        logResourceLoader("Loaded " + retJson.size + " weapons images from " + ResourceLoader.WEAPONS_DIR_PATH);
        return retJson;
    }

    loadInventoryHTMLs() {
        const retJson = this._loadFilesFromDirBase64json(ResourceLoader.INVENTORY_HTMLS_PATH);
        logResourceLoader("Loaded "+ retJson.size + " htmls for inventory from " + ResourceLoader.INVENTORY_HTMLS_PATH);
        const m = new Map();
        return retJson;
    }

    //start:


    /**
     * 
     * @param {string} dir - directory to load from, relative to /LoginWebsite/
     * @returns {string} files
     */
    _loadFilesFromDirBase64json(dir) {
        const ret = new Map();
        const fileNames = fs.readdirSync(path.resolve(dir));
        fileNames.forEach(currFile => {
            const splitted = currFile.split(".");
            if(splitted.length > 2) {
                throw new Error("Trying to map file name to item ID but filename has multiple dots!: " + currFile);
            }

           ret.set(splitted[0], fs.readFileSync(dir + "/" + currFile, {encoding: 'base64'}));
        });
        const json = JSON.stringify(Object.fromEntries(ret));
        
        return json;
    }
}

function logResourceLoader(s) {
    console.log("[RessourceLoader] " + s);
}

module.exports = ResourceLoader;