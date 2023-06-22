const Stats = require("../../GameStatic/js/gameplay/stats/stats");
const Vector = require("../../GameStatic/js/maths/vector");

class FacadeForFightingObject {
    
    /**
     * @returns {Vector} position of owner
     */
    getOwnerPosition(){
        throw "Get owner position not implemented";
    }

    /**
     * @returns {Stats}
     */
    getOwnerStats() {
        throw "Get owner stats not implemented";
    }
}

module.exports = FacadeForFightingObject;