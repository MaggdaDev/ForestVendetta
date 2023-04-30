const ArmorPiece = require("../armorPiece");
class FrogBoots extends ArmorPiece {
    static NAME = "FROG_BOOTS";
    constructor(owner, id) {
        super(owner, id);
        super.setName(FrogBoots.NAME);
    }
}

module.exports = FrogBoots;