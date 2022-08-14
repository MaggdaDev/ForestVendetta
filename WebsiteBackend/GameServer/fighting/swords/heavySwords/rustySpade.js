const HeavySword = require("./heavySword");

class RustySpade extends HeavySword {
    static COOLDOWN = 0.8;
    constructor(owner) {
        super({type: "RUSTY_SPADE"}, owner, RustySpade.COOLDOWN);
        this.damage = 5;
    }
}   

module.exports = RustySpade;