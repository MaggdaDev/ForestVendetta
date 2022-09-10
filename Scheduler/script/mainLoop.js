class MainLoop {
    static INTERVAL = 2000;
    constructor(scheduler) {
        this.loopCount = 0;
        this.startTime;
        this.scheduler = scheduler;
    }

    /**
     * 
     * @param {MainLoop} instance 
     */
     _loop(instance) {          // all loop logic
        instance.loopLogging();
        instance.test();
    }

    test() {
        this.scheduler.sendTestMessage();
    }

    start() {
        this.startTime = Date.now();
        setInterval(()=>this._loop(this), MainLoop.INTERVAL);
    }

    loopLogging() {
        logMainLoop('Starting loop cycle ' + this.loopCount + '... (loop running for ' + (Date.now() - this.startTime) + 'ms)');
        this.loopCount += 1;
    }
}

function logMainLoop(s) {
    console.log("[MainLoop] " + s);
}

module.exports = MainLoop;