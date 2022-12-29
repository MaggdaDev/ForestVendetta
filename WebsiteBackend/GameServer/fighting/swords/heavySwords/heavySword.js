const Sword = require("../sword");
const PolygonHitBox = require("../../../physics/polygonHitBox");
const HeavyStrike = require("./heavyStrike");
const HitBox = require("../../../physics/hitbox");
const FightingObject = require("../../fightingObject");

class HeavySword extends Sword {

    /**
     * 
     * @param {Object} typeData
     * @param {string} typeData.type 
     */
    constructor(typeData, owner, weaponID) {
        typeData.subClass = "HEAVY_SWORD";
        super(typeData, owner, weaponID);

        this.setupHitBoxes();

        this.canDamage = false;

        this.alreadyDamagedIds = new Set();

        //strike animation
        this.strikeAnimation = new HeavyStrike(0.3, 0.2, this);
        this.setupStrikeAnimation();
    }

    setupHitBoxes() {
        this.hitBox = new PolygonHitBox([{ x: -40, y: -80 }, { x: 25, y: -85 }, { x: 65, y: -65 }, { x: 100, y: -30 }, { x: 115, y: 10 }, { x: 30, y: 0 }]);
        this.rightHitBox = this.hitBox;
        this.rightHitBox.setOriginToZero();
        this.leftHitBox = this.hitBox.getMirrored();
        this.leftHitBox.setOriginToZero();
    }

    setupStrikeAnimation() {
        var instance = this;
        this.strikeAnimation.onStartStrike = () => {
            instance.alreadyDamagedIds.clear();
            instance.canDamage = true;

        };

        this.strikeAnimation.onEndStrike = () => {
            instance.canDamage = false;

        };
    }

    getCooldown() {
        return this.baseCombatStats.cooldown;
    }

    strike() {
        this.strikeAnimation.start();
        return this.strikeAnimation;
    }

    update(timeElapsed, damagables, playerPos, facingLeft) {
        if (facingLeft) {
            this.hitBox = this.leftHitBox;
        } else {
            this.hitBox = this.rightHitBox;
        }
        this.strikeAnimation.update(timeElapsed);
        if (this.strikeAnimation.currentlyDelaying || this.strikeAnimation.currentlyStriking) {
            this.hitBox.pos = playerPos;
        }
        if (this.canDamage) {
            damagables.forEach(element => {
                if (this.fighter.canDamage(element.fightingObject)) {
                    if (!this.alreadyDamagedIds.has(element.fightingObject.id)) {
                        var ints = HitBox.getIntersections(this.hitBox, element.hitBox)
                        if (ints !== null && ints !== undefined && ints.length > 0) {
                            this.damageDamagable(element.fightingObject, ints[0], element.pos);
                        }
                    }
                }
            });
        }
    }

    damageDamagable(fightingObject, intersection, otherPos) {
        this.alreadyDamagedIds.add(fightingObject.id);
        var damageDone = FightingObject.aDamageB(this.fighter, fightingObject, this.owner.pos, otherPos, intersection.intersectionPoint);
    }

    /**
     * OVERRIDE
     */
    toJSON() {
        var instance = this;
        return {
            id: instance.id,
            typeData: instance.typeData,
            hitBox: this.hitBox
        }
    }

}

module.exports = HeavySword;