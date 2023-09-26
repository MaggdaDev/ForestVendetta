const AbilityPerformerAbstract = require("../abilityPerformerAbstract");

class FrogAbilityPerformer extends AbilityPerformerAbstract {
    constructor(owner, abilityPool, abilityIdSelection, rarity) {
        super(owner, abilityPool, abilityIdSelection, rarity);
        super.addOnUpdate((timeElapsed) => this.thinkAboutPerformingAbilities(timeElapsed));
    }

    /**
     * @description philosophical
     */
    thinkAboutPerformingAbilities(timeElapsed) {
        if (this.isReady()) {
            if (Math.random() < 0.5) {
                this.queueAbility("JUMP_ABILITY");
            } else {
                this.queueAbility("TONGUE_SLAP_ABILITY");
            }
        }
    }

}

module.exports = FrogAbilityPerformer;