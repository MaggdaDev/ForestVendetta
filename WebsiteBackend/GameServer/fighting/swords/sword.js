const Weapon = require("../weapon");

class Sword extends Weapon{
    /**
     * 
     * @param {Object} typeData 
     * @param {string} typeData.subClass
     * @param {string} typeData.type
     */
    constructor(typeData, owner) {
        typeData.class = "SWORD";
        super(typeData, owner);
    }
}

module.exports = Sword;