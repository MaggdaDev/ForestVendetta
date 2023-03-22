const rarityConfig = require("../../../GameplayConfig/Items/itemRarity.json");
const StopwatchHandler = require("../../../GameStatic/js/util/stopwatchHandler");


class AbilityPerformerAbstract {
    static COOLDOWN_TIMER_NAME = "cooldown";
    static rarityValues = Object.getOwnPropertyNames(rarityConfig);
    constructor(owner, abilityPool, abilityIdSelection, rarity) {
        this.owner = owner;
        this.abilities = {};
        this._insertAbilitiesFromName(abilityPool, abilityIdSelection);
        this._insertAbilitiesFromRarity(abilityPool, rarity);

        // handlers
        this.onUpdate = [];

        // ability queue
        /**
         * @description respects execution time but ignores cooldowns; add with push and remove with shift
         */
        this.abilityQueue = [];

        // stopwatches
        this.setupStopwatches();
    }

    setupStopwatches() {
        this.stopwatchHandler = new StopwatchHandler();
        this.stopwatchHandler.createStopwatch("existing");

        this.stopwatchHandler.createStopwatch("timeSinceLastAction");

        this.stopwatchHandler.createStopwatch(AbilityPerformerAbstract.COOLDOWN_TIMER_NAME);
        this.stopwatchHandler.pauseStopwatch(AbilityPerformerAbstract.COOLDOWN_TIMER_NAME);

        this.stopwatchHandler.createStopwatch("abilityExecution");
        this.stopwatchHandler.pauseStopwatch("abilityExecution");
    }

    queueAbility(abilityName) {
        this.abilityQueue.push(abilityName);
    }

    update(timeElapsedSeconds) {
        this.stopwatchHandler.update(timeElapsedSeconds);
        if(!this.stopwatchHandler.isRunning("abilityExecution")) {
           this._progressAbilityQueue(); 
        }
        
        this.onUpdate.forEach((currFunc) => currFunc(timeElapsedSeconds));
    }

    isReady() {
        return !(this.stopwatchHandler.isRunning("abilityExecution") || this.stopwatchHandler.isRunning(AbilityPerformerAbstract.COOLDOWN_TIMER_NAME));
    }

    /**
     * @description executed at complete end of update method
     * @param {function(timeElapsed)} handler 
     */
    addOnUpdate(handler) {
        this.onUpdate.push(handler);
    }

    /**
     * @returns true if an action was performed
     */
    _progressAbilityQueue() {
        if (this.abilityQueue.length > 0) {
            this._performActiveAbility(this.abilityQueue.shift());
            return true;
        }
        return false;
    }

    _performActiveAbility(abilityName) {
        this.owner[abilityName]();
        this.stopwatchHandler.resetStopwatch("timeSinceLastAction");
        this.stopwatchHandler.resetStopwatch("abilityExecution");
        this.stopwatchHandler.setExpire("abilityExecution", this.abilities[abilityName].execution_time, () => this._onAbilityExecutionFinished(abilityName));
        this.stopwatchHandler.resumeStopwatch("abilityExecution");

    }

    _onAbilityExecutionFinished(abilityName) {
        console.log("Ability execution finished");
        this.stopwatchHandler.pauseStopwatch("abilityExecution");
        if (!this._progressAbilityQueue()) {
            this.stopwatchHandler.resetStopwatch(AbilityPerformerAbstract.COOLDOWN_TIMER_NAME);
            this.stopwatchHandler.setExpire(AbilityPerformerAbstract.COOLDOWN_TIMER_NAME, this.abilities[abilityName].cooldown);
            this.stopwatchHandler.resumeStopwatch(AbilityPerformerAbstract.COOLDOWN_TIMER_NAME);
        }
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
            if (currRarity !== undefined) {
                if (AbilityPerformerAbstract.isRarityAEqualLessToB(currRarity, rarity)) {
                    this.abilities[currAbilityName] = currAbility;
                }
            }
        })
    }

    static isRarityAEqualLessToB(a, b) {
        return AbilityPerformerAbstract.rarityValues.indexOf(a) <= AbilityPerformerAbstract.rarityValues.indexOf(b);
    }
}

module.exports = AbilityPerformerAbstract;