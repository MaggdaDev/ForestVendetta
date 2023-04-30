const Weapon = require("../weapon");

class Sword extends Weapon{

    constructor(owner, weaponID) {
        super(owner, weaponID);
        super.setClass("SWORD");
    }
}

module.exports = Sword;