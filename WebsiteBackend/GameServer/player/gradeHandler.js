const FightingObject = require("../fighting/fightingObject");
const MobManager = require("../mobs/mobManager");

class GradeHandler {
    static gradeConfig = require("../../GameplayConfig/Gameplay/grades.json");

    static DAMAGE_PARTICIPATION_TOLERANCE = 0.1;
    static TIME_ATTENDED_TOLERANCE = 0.1;
    static DEATH_PENALTY = 150;
    static PERCENT_AFTER_DOUBLE_TIME = 0.25;
    /**
     * 
     * @param {FightingObject} fightingObject 
     * @param {MobManager} mobManager 
     */
    constructor(fightingObject, mobManager, deathsGetter, stopwatchIngameSecondsGetter, stopwatchGameRunningGetter) {
        this.mobManager = mobManager;
        this.fightingObject = fightingObject;
        this.deathsGetter = deathsGetter;
        this.stopwatchIngameSecondsGetter = stopwatchIngameSecondsGetter;
        this.stopwatchGameRunningGetter = stopwatchGameRunningGetter;
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

        // time attended
        const timeAttended = this.stopwatchIngameSecondsGetter();
        const gameRunning = this.stopwatchGameRunningGetter();
        if (gameRunning > 0) {
            points += Math.min(100, 100 * timeAttended / ((1 - GradeHandler.TIME_ATTENDED_TOLERANCE) * gameRunning));
        } else { points += 100 }

        // graded time
        const gradedTime = this.mobManager.getCurrentMatchConfig().graded_match_duration;
        const gradedTimePointsAdd = Math.max(0, Math.min(100, 100 * Math.pow(0.25, gameRunning/gradedTime - 1)));
        points += gradedTimePointsAdd;
       

        // no damage taken
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
            this.lastDamagePoints = Math.min(100, 100 * this.damageDealt / ((1 - GradeHandler.DAMAGE_PARTICIPATION_TOLERANCE) * this.mobManager.totalMaxHp));
        }
        points += this.lastDamagePoints;


        return points;
    }

    calculateIndex() {
        const points = this.calculatePoints();
        return Math.max(0, Math.min(Math.floor(points / 100), GradeHandler.gradeConfig.length - 1));
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