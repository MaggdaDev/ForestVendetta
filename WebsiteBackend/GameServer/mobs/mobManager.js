const Frog = require("./frog");
const Mob = require("./mob");

const frogConfig = require("../../GameplayConfig/Bosses/frog");
class MobManager {
    constructor(networkManager,players, world, weaponManager) {
        this.currId = 0;
        this.mobs = new Map();
        this.networkManager = networkManager;
        this.players = players;
        this.world = world;
        this.mobsToRemove = [];
        this.weaponManager = weaponManager;
    }

    get nextID() {
        var temp = this.currId;
        this.currId++;
        return "M" + String(temp);
    }
    spawnFrog(x,y) {
        var frog = new Frog(x,y,this.nextID, this.players, this.world, frogConfig, this.weaponManager);
        this.mobs.set(frog.id, frog);
        this.networkManager.sendSpawnMobCommand(frog);
        return frog;
    }

    spawnRespawningFrog(x,y) {
        var frog = this.spawnFrog(x,y);
        var instance = this;
        frog.addOnDeath(()=>{
            instance.spawnRespawningFrog(x,y);
        });
    }

    updateMobs(timeElapsed, worldIntersectables, mobIntersectables, playerIntersectables) {
        this.mobs.forEach((currMob)=>{
            currMob.update(timeElapsed, worldIntersectables, mobIntersectables, playerIntersectables);
        });
        this.checkRemoveMobs();
    }

    checkRemoveMobs() {
        this.mobsToRemove = [];
        this.mobs.forEach((mob)=>{
            if(mob.shouldRemove) {
                this.mobsToRemove.push({id: mob.id, type: "MOB"});
            }
        });
        
        this.mobsToRemove.forEach((mob)=>{
            this.mobs.delete(mob.id);
        });
        if(this.mobsToRemove.length > 0) {
            this.networkManager.sendRemoveMobsCommand(this.mobsToRemove);
        }
    }

    get mobArray() {
        return Array.from(this.mobs.values());
    }

    get mobUpdateData() {
        return Array.from(this.mobs.values());
    }
}

module.exports = MobManager;