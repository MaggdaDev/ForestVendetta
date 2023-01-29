const fs = require('node:fs');
const path = require('path');
class ResourceLoader {
    static WEAPONS_DIR_PATH = "../WebsiteBackend/GameClient/images/weapons";
    static INVENTORY_HTMLS_PATH = "../WebsiteBackend/GameClient/html/inventory";
    static INGAME_UI_CSS_PATH = "../WebsiteBackend/GameClient/css";
    static ITEMS_CONFIG_PATH = "../WebsiteBackend/GameplayConfig/Items";

    /**
     * 
     * @returns {URLSearchParams} weapon images as form data
     */
    loadWeaponImages() {
        const retJson = this._loadFilesFromDirBase64json(ResourceLoader.WEAPONS_DIR_PATH);
        logResourceLoader("Loaded weapon images from " + ResourceLoader.WEAPONS_DIR_PATH);
        return retJson;
    }

    loadInventoryHTMLs() {
        const retJson = this._loadFilesFromDirJson(ResourceLoader.INVENTORY_HTMLS_PATH);
        logResourceLoader("Loaded htmls for inventory from " + ResourceLoader.INVENTORY_HTMLS_PATH);
        return retJson;
    }

    loadIngameUICSS() {
        const retJson = this._loadFilesFromDirJson(ResourceLoader.INGAME_UI_CSS_PATH);
        logResourceLoader("Loaded ingame ui css from " + ResourceLoader.INVENTORY_HTMLS_PATH);
        return retJson;
    }

    loadItemsConfigJson() {
        const retJson = this._loadFilesRecursiveJson(ResourceLoader.ITEMS_CONFIG_PATH);
        logResourceLoader("Loaded item configs");
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

    _loadFilesFromDirJson(dir) {
        const ret = new Map();
        const fileNames = fs.readdirSync(path.resolve(dir));
        fileNames.forEach(currFile => {
            const splitted = currFile.split(".");
            if(splitted.length > 2) {
                throw new Error("Trying to map file name to item ID but filename has multiple dots!: " + currFile);
            }

           ret.set(splitted[0], fs.readFileSync(dir + "/" + currFile, {encoding: "utf8"}));
        });
        const json = JSON.stringify(Object.fromEntries(ret));
        
        return json;
    }

    _loadFilesRecursiveJson(dir, map) {
        var isStart =  false;
        if(map === undefined) {
            isStart = true;
            map = new Map();
            logResourceLoader("Recursive file loading start detected...");
        }
        const fileNames = fs.readdirSync(path.resolve(dir));
        fileNames.forEach(currFile => {
            const splitted = currFile.split(".");
            if(splitted.length !== 2) {
                this._loadFilesRecursiveJson(dir + "/" + currFile, map);
            } else {
                map.set(splitted[0], fs.readFileSync(dir + "/" + currFile, {encoding: "utf8"}));
            }
        });

        if(isStart) {
            return JSON.stringify(Object.fromEntries(map));
        }
    }
}

function logResourceLoader(s) {
    console.log("[RessourceLoader] " + s);
}

module.exports = ResourceLoader;