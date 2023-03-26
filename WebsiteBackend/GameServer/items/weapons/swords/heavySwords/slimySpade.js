const HeavySword = require("./heavySword");

class SlimySpade extends HeavySword {
    constructor(owner, weaponID) {
        super(owner, weaponID);
        super.setName("SLIMY_SPADE");
    }
}   

module.exports = SlimySpade;