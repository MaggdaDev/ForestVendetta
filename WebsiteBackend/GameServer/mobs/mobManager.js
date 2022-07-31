const Frog = require("./frog");
const Mob = require("./mob");

class MobManager {
    constructor(networkManager,players, world) {
        this.currId = 0;
        this.mobs = new Map();
        this.networkManager = networkManager;
        this.players = players;
        this.world = world;
    }

    get nextID() {
        var temp = this.currId;
        this.currId++;
        return temp;
    }
    spawnFrog(x,y) {
        var frog = new Frog(x,y,this.nextID, this.players, this.world);
        this.mobs.set(frog.id, frog);
        this.networkManager.sendSpawnMobCommand(frog);
    }

    updateMobs(timeElapsed, intersectables) {
        this.mobs.forEach((currMob)=>{
            currMob.update(timeElapsed, intersectables);
        })
    }

    get mobUpdateData() {
        return Array.from(this.mobs.values());
    }
}

module.exports = MobManager;