const HeavySword = require("./heavySword");

class RustySpade extends HeavySword {
    constructor(fighter) {
        super({type: "RUSTY_SPADE"}, fighter);
        this.damage = 5;
    }
}   

module.exports = RustySpade;