const DamageObject = require("../damageObject");

class DamageVisitor {

    /**
     * @description override this. Method for modifying damage
     * @param {DamageObject} damageObject 
     * @default
     */
    visitDamageObject(damageObject) {
        throw "Visit damage object not overridden!"
    }
}

module.exports = DamageVisitor;