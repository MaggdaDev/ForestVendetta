const AbilityPerformerAbstract = require("../abilityPerformerAbstract");

class FrogAbilityPerformer extends AbilityPerformerAbstract {
    constructor(owner, abilityPool, abilityIdSelection, rarity) {
        super(owner, abilityPool, abilityIdSelection, rarity);
        super.addOnUpdate((timeElapsed)=> this.thinkAboutPerformingAbilities(timeElapsed));
    }

    /**
     * @description philosophical
     */
    thinkAboutPerformingAbilities(timeElapsed) {
        if(this.isReady()) {
            this.queueAbility("JUMP_ABILITY");
        }
    }

}

module.exports = FrogAbilityPerformer;