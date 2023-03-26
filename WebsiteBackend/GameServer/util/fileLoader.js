const path = require("path");
const fs = require("fs")

class FileLoader {
    static loadFilesRecursive(dir, map) {
        var isStart =  false;
        if(map === undefined) {
            isStart = true;
            map = new Map();
            console.log("Loading config files recursively")
        }
        const fileNames = fs.readdirSync(path.resolve(dir));
        fileNames.forEach(currFile => {
            const splitted = currFile.split(".");
            if(splitted.length !== 2) {
                this.loadFilesRecursive(dir + "/" + currFile, map);
            } else {
                map.set(splitted[0], JSON.parse(fs.readFileSync(dir + "/" + currFile, {encoding: "utf8"})));
            }
        });

        if(isStart) {
            return map;
        }
    }
}

module.exports = FileLoader;