const Scheduler = require("./scheduler");
const Spawner = require("./spawning/spawner");

class MainLoop {
    static INTERVAL = 2000;

    /**
     * 
     * @param {Scheduler} scheduler 
     * @param {Spawner} spawner
     */
    constructor(scheduler, spawner) {
        this.loopCount = 0;
        this.startTime;
        this.scheduler = scheduler;
        this.spawner = spawner;
    }

    /**
     * 
     * @param {MainLoop} instance 
     */
     _loop(instance) {          // all loop logic
        instance.loopLogging();
        instance.spawnTicksForEveryGuild();
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