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
        if (!this.isBusy && this.isReady() && this.abilityQueue.length === 0) {
            if (Math.random() < 0.0) {
                this.queueAbility("JUMP_ABILITY");
            } else {
                this.queueAbility("TONGUE_AIMING_ABILITY");
            }
        }
    }

}

module.exports = FrogAbilityPerformer;