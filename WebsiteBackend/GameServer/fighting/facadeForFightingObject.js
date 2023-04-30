const Vector = require("../../GameStatic/js/maths/vector");

class FacadeForFightingObject {
    
    /**
     * @returns {Vector} position of owner
     */
    getOwnerPosition(){
        throw "Get owner position not implemented";
    }
}

module.exports = FacadeForFightingObject;