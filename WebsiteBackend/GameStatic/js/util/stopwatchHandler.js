class StopwatchHandler {
    constructor() {
        this.stopwatches = {};
    }

    /**
     * 
     * @param {string} name 
     * @param {number} expireAt time in seconds when expire, on expire: pause and then executeOnExpire
     * @param {function(time)} onExpired 
     */
    createStopwatch(name, expireAt = Number.MAX_SAFE_INTEGER, onExpired = (time) => { }) {
        this.stopwatches[name] = { time: 0, expireAt: expireAt, onExpired: onExpired, isRunning: true };
    }

    setExpire(name, expireAt, onExpired = (time)=>{}) {
        this.assureExisting(name);
        this.setOnExpired(name, onExpired);
        this.stopwatches[name].expireAt = expireAt;
    }

    isRunning(name) {
        this.assureExisting(name);
        return this.stopwatches[name].isRunning;
    }

    setOnExpired(name, onExpired) {
        this.assureExisting(name);
        this.stopwatches[name].onExpired = onExpired;
    }

    pauseStopwatch(name) {
        this.assureExisting(name);
        this.stopwatches[name].isRunning = false;
    }

    resumeStopwatch(name) {
        this.assureExisting(name);
        this.stopwatches[name].isRunning = true;
    }

    resetStopwatch(name, keepExpireConfig = false) {
        this.assureExisting(name);
        this.stopwatches[name].time = 0;
        if(!keepExpireConfig) {
            this.stopwatches[name].onExpired = (() => {});
            this.stopwatches[name].expireAt = Number.MAX_SAFE_INTEGER;
        }
    }

    expireStopwatch(name) {
        this.assureExisting(name);
        this.pauseStopwatch(name);
        this.stopwatches[name].onExpired(this.stopwatches[name].time);
    }

    removeStopwatch(name) {
        if (this.stopwatches[name] === undefined) {
            console.warn("Trying to remove stopwatch " + name + " which doesnt exist!");
        }
        this.stopwatches[name] = undefined;
    }

    getTime(name) {
        this.assureExisting(name);
        return this.stopwatches[name].time;
    }

    assureExisting(name) {
        if(this.stopwatches[name] === undefined) throw "Unknown stopwatch: " + name;
    }

    update(timeElapsedSeconds) {
        Object.getOwnPropertyNames(this.stopwatches).forEach((currName) => {
            if (this.stopwatches[currName].isRunning) {
                this.stopwatches[currName].time += timeElapsedSeconds;
                if (this.stopwatches[currName].time >= this.stopwatches[currName].expireAt) {
                    this.expireStopwatch(currName);
                }
            }
        });
    }
}

if (typeof module !== 'undefined') {
    module.exports = StopwatchHandler;
}