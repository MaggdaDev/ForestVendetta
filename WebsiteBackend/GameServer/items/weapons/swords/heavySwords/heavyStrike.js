class HeavyStrike {
    constructor(delay, strikeTime, weapon) {
        this.weapon = weapon;
        this.currentlyStriking = false;
        this.currentlyDelaying = false;
        this.timer = 0;
        this.strikeTime = strikeTime;
        this.delay = delay;
        this.onInitiateStrike = null;
        this.onStartDelay = null;
        this.onEndDelay = null;
        this.onStartStrike = null;
        this.onEndStrike = null;
    }

    start() {
        if (this.acceptsNew()) {
            this.timer = 0;
            this.currentlyDelaying = false;
            this.currentlyStriking = false;

            if(this.onInitiateStrike !== null) this.onInitiateStrike();

            this.startDelay();
        }
    }


    acceptsNew() {
        return !(this.currentlyStriking || this.currentlyDelaying);
    }

    update(timeElapsed) {
        this.timer += timeElapsed;
        if (this.currentlyDelaying) {
            if (this.timer > this.delay) {
                this.delayToStrike();
                this.timer = 0;
            }
        } else if (this.currentlyStriking) {
            if (this.timer > this.strikeTime) {
                this.endStrike();
                this.timer = 0;
            }
        }
    }

    startDelay() { // first state => start here
        this.currentlyDelaying = true;
        if(this.onStartDelay !== null) this.onStartDelay();
    }

    delayToStrike() {
        if(this.onEndDelay !== null) this.onEndDelay();
        this.currentlyDelaying = false;
        this.currentlyStriking = true;
        if(this.onStartStrike !== null) this.onStartStrike();
    }

    endStrike() {
        this.currentlyStriking = false;
        if(this.onEndStrike !== null) this.onEndStrike();
    }


}

module.exports = HeavyStrike;