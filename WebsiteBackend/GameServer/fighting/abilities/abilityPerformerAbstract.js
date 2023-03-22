const rarityConfig = require("../../../GameplayConfig/Items/itemRarity.json");

class AbilityPerformerAbstract {
    static rarityValues = Object.getOwnPropertyNames(rarityConfig);
    constructor(owner, abilityPool, abilityIdSelection, rarity) {
        this.owner = owner;
        this.abilities = {};
        this._insertAbilitiesFromName(abilityPool, abilityIdSelection);
        this._insertAbilitiesFromRarity(abilityPool, rarity);
    }

    _insertAbilitiesFromName(abilityPool, abilityNames) {
        abilityNames.forEach((abilityName) => {
            this.abilities[abilityName] = abilityPool[abilityName];
        });
    }

    _insertAbilitiesFromRarity(abilityPool, rarity) {
        const abilityPoolNames = Object.getOwnPropertyNames(abilityPool);
        abilityPoolNames.forEach((currAbilityName, index) => {
            const currAbility = abilityPool[currAbilityName];
            const currRarity = currAbility.rarity;
            if(currRarity !== undefined) {
                if(AbilityPerformerAbstract.isRarityAEqualLessToB(currRarity, rarity)) {
                    this.abilities[currAbilityName] = currAbility;
                }
            }
        })
    }

    static isRarityAEqualLessToB(a,b) {
        return AbilityPerformerAbstract.rarityValues.indexOf(a) >= AbilityPerformerAbstract.rarityValues.indexOf(b);
    }
}

module.exports = AbilityPerformerAbstract;