const Weapon = require("../weapon");

class Sword extends Weapon{
    /**
     * 
     * @param {Object} typeData 
     * @param {string} typeData.subClass
     * @param {string} typeData.type
     */
    constructor(typeData, owner, weaponID) {
        typeData.class = "SWORD";
        super(typeData, owner, weaponID);
    }
}

module.exports = Sword;