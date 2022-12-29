const HeavySword = require("./heavySword");

class RustySpade extends HeavySword {
    constructor(owner, weaponID) {
        super({type: "RUSTY_SPADE"}, owner, weaponID);
    }
}   

module.exports = RustySpade;