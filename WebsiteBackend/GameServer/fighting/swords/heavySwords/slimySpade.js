const HeavySword = require("./heavySword");

class SlimySpade extends HeavySword {
    constructor(owner, weaponID) {
        super({type: "SLIMY_SPADE"}, owner, weaponID);
    }
}   

module.exports = SlimySpade;