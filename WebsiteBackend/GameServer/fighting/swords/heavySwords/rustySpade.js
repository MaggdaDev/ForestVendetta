const HeavySword = require("./heavySword");

class RustySpade extends HeavySword {
    constructor(owner) {
        super({type: "RUSTY_SPADE"}, owner);
    }
}   

module.exports = RustySpade;