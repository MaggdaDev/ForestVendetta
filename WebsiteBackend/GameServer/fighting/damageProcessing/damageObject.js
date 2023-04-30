class DamageObject {
    constructor(initialDamage) {
        this.initialDamage = initialDamage;     // const
        this.flatDamageBoni = [];
        this.receiverDefenses = [];
    }

    getCurrentDamage() {
        return this.currentProcessedDamage;
    }

    addFlatDamage(additionalDamage) {
        this.flatDamageBoni.push(additionalDamage);
    }

    addReceiverDefense(defense) {
        this.receiverDefenses.push(defense);
    }

    getResultingDamage() {

        // flat additional damage
        var flatAdditionalDamage = 0;
        this.flatDamageBoni.forEach((currBonus) => {
            flatAdditionalDamage += currBonus;
        })

        // receiver defense
        var receiverDefense = 0;
        this.receiverDefenses.forEach((currBonus) => {
            receiverDefense += currBonus;
        })
        const defenseMultiplier = this.damageMultiplierFromDefense(receiverDefense);

        return defenseMultiplier * (this.initialDamage + flatAdditionalDamage);
    }

    damageMultiplierFromDefense(defense) {
        if(defense > 0) {
            return 1.0 / (0.01 * defense + 1);
        } else {
            return -0.01 * defense + 1;
        }
    }


}

module.exports = DamageObject;