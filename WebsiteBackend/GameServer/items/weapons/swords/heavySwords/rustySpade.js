const HeavySword = require("./heavySword");

class RustySpade extends HeavySword {
    constructor(owner, weaponID) {
        super(owner, weaponID);
        super.setName("RUSTY_SPADE");
    }
}   

module.exports = RustySpade;