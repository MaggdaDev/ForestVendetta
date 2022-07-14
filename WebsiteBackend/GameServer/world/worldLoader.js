const fs = require('fs');
const path = require('path');
const World = require('./world');
class WorldLoader {
    loadWorld() {
        var worldPath = path.join(__dirname, '../ressources/worlds/world.ahm');
        var worldAsJson = fs.readFileSync(worldPath);
        return new World(worldAsJson);
    }
}
module.exports = WorldLoader;