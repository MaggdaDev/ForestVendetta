const DamageObject = require("../damageObject");
const DamageVisitor = require("./damageVisitor");

class SimpleDefenseDamageVisitor extends DamageVisitor{
    constructor(defense) {
        super();
        this.defense = defense;
    }

    /**
     * 
     * @param {DamageObject} damageObject 
     */
    visitDamageObject(damageObject) {
        damageObject.addReceiverDefense(this.defense);
    }
}

module.exports = SimpleDefenseDamageVisitor;