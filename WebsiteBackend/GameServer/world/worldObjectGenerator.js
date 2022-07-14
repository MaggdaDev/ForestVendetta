const PolygonObject = require("./polygonObject");

class WorldObjectGenerator {
    static loadWorldObject(jsonObj, id) {
        switch(jsonObj.type) {
            case "POLYGON":
                return new PolygonObject(jsonObj, id);
                break;
            default:
                console.log("Error during world loading: Unkown object type: " + JSON.stringify(jsonObj));
                break;
        }
    }
}
module.exports = WorldObjectGenerator;