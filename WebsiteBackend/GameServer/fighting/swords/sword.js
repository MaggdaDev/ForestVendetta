const Weapon = require("../weapon");

class Sword extends Weapon{
    /**
     * 
     * @param {Object} typeData 
     * @param {string} typeData.subClass
     * @param {string} typeData.type
     */
    constructor(typeData, fighter) {
        typeData.class = "SWORD";
        super(typeData, fighter);
    }
}

module.exports = Sword;