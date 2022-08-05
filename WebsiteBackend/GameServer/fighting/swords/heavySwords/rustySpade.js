const HeavySword = require("./heavySword");

class RustySpade extends HeavySword {
    static COOLDOWN = 0.8;
    constructor(fighter, onDamage) {
        super({type: "RUSTY_SPADE"}, fighter, RustySpade.COOLDOWN, onDamage);
        this.damage = 5;
    }
}   

module.exports = RustySpade;