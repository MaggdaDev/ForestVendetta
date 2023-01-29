const HeavySword = require("./heavySword");

class ObsidianPineNeedle extends HeavySword {
    constructor(owner, weaponID) {
        super({type: "OBSIDIAN_PINE_NEEDLE"}, owner, weaponID);
    }
}   

module.exports = ObsidianPineNeedle;