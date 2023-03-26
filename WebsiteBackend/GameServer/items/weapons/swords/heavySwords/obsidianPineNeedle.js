const HeavySword = require("./heavySword");

class ObsidianPineNeedle extends HeavySword {
    constructor(owner, weaponID) {
        super(owner, weaponID);
        super.setName("OBSIDIAN_PINE_NEEDLE")
    }
}   

module.exports = ObsidianPineNeedle;