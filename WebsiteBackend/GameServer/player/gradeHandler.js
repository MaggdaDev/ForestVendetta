const FightingObject = require("../fighting/fightingObject");
const MobManager = require("../mobs/mobManager");

class GradeHandler {
    static gradeConfig = require("../../GameplayConfig/Gameplay/grades.json");

    static DAMAGE_PARTICIPATION_TOLERANCE = 0.1;
    static DEATH_PENALTY = 150;
    /**
     * 
     * @param {FightingObject} fightingObject 
     * @param {MobManager} mobManager 
     */
    constructor(fightingObject, mobManager, deathsGetter) {
        this.mobManager = mobManager;
        this.fightingObject = fightingObject;
        this.deathsGetter = deathsGetter;
        this.resetStates();
        // criteria
        this.fightingObject.addOnDamageTaken(() => {
            this.damageTaken = true;
        });
        this.fightingObject.addOnDamageDealt((dmg) => {
            this.damageDealt += dmg;
        });

        this.mobManager.addOnMobDeath((mob, killerID) => {
            if (killerID === this.fightingObject.id) {
                this.lastHit = true;
            } else {
                this.lastHit = false;
            }
        });

        // reset
        this.mobManager.addOnFightReset(() => {
            this.resetStates();
        });
    }

    resetStates() {
        this.damageTaken = false;
        this.lastHit = false;
        this.damageDealt = 0;
        this.lastDamagePoints = 0;
    }

    calculatePoints() {
        var points = 0.0;

        // death
        points -= this.deathsGetter() * GradeHandler.DEATH_PENALTY;

        // 
        if (!this.damageTaken) {
            points += 100;
        }

        // last hit
        if (this.lastHit) {
            points += 100;
        }

        // damage participation
        const totalMaxHp = this.mobManager.totalMaxHp;
        if (totalMaxHp > 0) {
            this.lastDamagePoints = 100 * this.damageDealt / ((1 - GradeHandler.DAMAGE_PARTICIPATION_TOLERANCE) * this.mobManager.totalMaxHp);
        }
        points += this.lastDamagePoints;


        return points;
    }

    calculateIndex() {
        const points = this.calculatePoints();
        return Math.max(0,Math.min(Math.floor(points / 100), GradeHandler.gradeConfig.length - 1));
    }

    /**
     * @description use this to get the new grade
     */
    get grade() {
        const idx = this.calculateIndex();
        return GradeHandler.gradeConfig[idx].name;
    }

    get dropProbabilityModifier() {
        const idx = this.calculateIndex();
        return GradeHandler.gradeConfig[idx].probability_modifier;
    }
}

module.exports = GradeHandler;