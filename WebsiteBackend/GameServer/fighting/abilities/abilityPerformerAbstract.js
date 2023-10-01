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

        this.currentAbility = null;

        // handlers
        this.onUpdate = [];
        this.onAbilityExecutionFinished = [];


        // ability queue
        /**
         * @description respects execution time but ignores cooldowns; add with push and remove with shift
         */
        this.abilityQueue = [];
        this.isBusy = false;

        // stopwatches
        this.setupStopwatches();
    }

    setBusy(busy) {
        console.log("Set busy from " + this.isBusy + " to " + busy);
        this.isBusy = busy;
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

    performAbilityNow(abilityName) {
        this._performActiveAbility(abilityName);
    }

    update(timeElapsedSeconds) {
        this.stopwatchHandler.update(timeElapsedSeconds);
        if(!this.isBusy && !this.stopwatchHandler.isRunning("abilityExecution")) {
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
     * @description dont call directly after executeNow, otherwise the onFinishedMethod will be called for interrupted ability
     * @param {function (abilityName)} handler
     */
    addOnAbilityExecutionFinished(handler) {
        this.onAbilityExecutionFinished.push(handler);
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
        if(this.stopwatchHandler.isRunning("abilityExecution") && this.currentAbility !== null) {
            this._onAbilityExecutionFinished(true, abilityName);
            console.log("Interrupted ability: " + this.currentAbility + " with " + abilityName);
        }
        this.currentAbility = abilityName;
        this.owner[abilityName]();
        this.stopwatchHandler.resetStopwatch("timeSinceLastAction");
        this.stopwatchHandler.resetStopwatch("abilityExecution");
        this.stopwatchHandler.setExpire("abilityExecution", this.abilities[abilityName].execution_time, () => this._onAbilityExecutionFinished(false, abilityName));
        this.stopwatchHandler.resumeStopwatch("abilityExecution");

    }

    _onAbilityExecutionFinished(isInterrupted, abilityName) {
        console.log("Ability execution finished");
        this.stopwatchHandler.pauseStopwatch("abilityExecution");
        this.currentAbility = null;
        const remHandlerIdcs = [];
        var currHandler;
        for(var i = 0; i < this.onAbilityExecutionFinished.length; i += 1) {
            currHandler = this.onAbilityExecutionFinished[i];
            currHandler(isInterrupted);
            remHandlerIdcs.push(i);
        }
        this.onAbilityExecutionFinished = this.onAbilityExecutionFinished.filter((item, idx) => (!remHandlerIdcs.includes(idx)));
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