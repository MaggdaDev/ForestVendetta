const Scheduler = require("./scheduler");
const Spawner = require("./spawning/spawner");

class MainLoop {
    static INTERVAL = 2000;

    /**
     * 
     * @param {Scheduler} scheduler 
     * @param {Spawner} spawner
     */
    constructor(scheduler, spawner, isTestMode) {
        this.loopCount = 0;
        this.startTime;
        this.scheduler = scheduler;
        this.spawner = spawner;
        this.isTestMode = isTestMode;
    }

    /**
     * 
     * @param {MainLoop} instance 
     */
     _loop(instance) {          // all loop logic
        instance.loopLogging();
        if(this.isTestMode) {
            instance.spawnTicksForEveryGuild();
        } else {
            console.log("Skipped spawning due to serious mode!");
        }
        
    }

    
    spawnTicksForEveryGuild() {
        this.scheduler.guildSpawnInfos.forEach((currSpawnInfo)=>{
            this.spawner.spawnTick(MainLoop.INTERVAL, currSpawnInfo);
        });
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