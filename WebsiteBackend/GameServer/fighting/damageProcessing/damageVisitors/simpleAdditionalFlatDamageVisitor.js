const DamageVisitor = require("./damageVisitor");

class SimpleAdditionalFlatDamageVisitor extends DamageVisitor {
    constructor(additionalFlatDamage) {
        super();
        this.addDamage = additionalFlatDamage;
    }

    /**
     * 
     * @param {DamageObject} damageObject 
     */
    visitDamageObject(damageObject) {
        damageObject.addFlatDamage(this.addDamage);
    }
}

module.exports = SimpleAdditionalFlatDamageVisitor;