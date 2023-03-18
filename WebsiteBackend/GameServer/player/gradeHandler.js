const FightingObject = require("../fighting/fightingObject");
const MobManager = require("../mobs/mobManager");

class GradeHandler {
    static GRADES = ["D", "C", "B", "A", "S", "SS"];

    static DAMAGE_PARTICIPATION_TOLERANCE = 0.1;
    /**
     * 
     * @param {FightingObject} fightingObject 
     * @param {MobManager} mobManager 
     */
    constructor(fightingObject, mobManager) {
        this.mobManager = mobManager;
        this.fightingObject = fightingObject;
        this.gradePoints = 0;
        this.damageDealt = 0;

        // criteria
        this.damageTaken = false;
        this.fightingObject.addOnDamageTaken(() => {
            this.damageTaken = true;
        });
        this.fightingObject.addOnDamageDealt((dmg) => {
            this.damageDealt += dmg;
        });

        this.lastHit = false;
        this.mobManager.addOnMobDeath((mob, killerID) => {
            if(killerID === this.fightingObject.id) {
                this.lastHit = true;
            } else {
                this.lastHit = false;
            }
        });
    }

    calculateGrade() {
        var points = 0.0;

        // 
        if(!this.damageTaken) {
            points += 100;
        }

        // last hit
        if(this.lastHit) {
            points += 100;
        }

        // damage participation
        points += 100 * this.damageDealt / ((1 - GradeHandler.DAMAGE_PARTICIPATION_TOLERANCE) * this.mobManager.totalMaxHp);

        const idx = Math.min(Math.floor(points/100), GradeHandler.GRADES.length-1);
        return GradeHandler.GRADES[idx];
    }

    /**
     * @description use this to get the new grade
     */
    get grade() {
        return this.calculateGrade();
    }
}

module.exports = GradeHandler;