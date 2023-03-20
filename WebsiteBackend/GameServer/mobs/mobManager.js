const Frog = require("./frog");
const Mob = require("./mob");

const frogConfig = require("../../GameplayConfig/Bosses/frog");
class MobManager {
    constructor(networkManager, players, world, weaponManager) {
        this.currId = 0;
        this.mobs = new Map();
        this.networkManager = networkManager;
        this.players = players;
        this.world = world;
        this.mobsToRemove = [];
        this.weaponManager = weaponManager;

        this.match = null;

        // events
        this.onMobDeath = [];
        this.onFightReset = [];
    }

    get nextID() {
        var temp = this.currId;
        this.currId++;
        return "M" + String(temp);
    }

    /**
     * 
     * @param {Mob} mob 
     */
    spawn(mob) {
        this.match = mob.getMobConfig().match_config;
        this.mobs.set(mob.id, mob);
        this.networkManager.sendSpawnMobCommand(mob);
        mob.addOnKilled((killer) => {
            this.onMobDeath.forEach((handler) => {
                handler(mob, killer);
            });
        });
    }

    spawnFrog(x, y) {
        var frog = new Frog(x, y, this.nextID, this.players, this.world, frogConfig, this.weaponManager);
        this.spawn(frog);
        return frog;
    }

    spawnRespawningFrog(x, y) {
        var frog = this.spawnFrog(x, y);
        var instance = this;
        frog.addOnDeath(() => {
            setTimeout(() => {
                instance.reset();
                instance.spawnRespawningFrog(x, y);
            }, 5000);

        });
    }

    updateMobs(timeElapsed, worldIntersectables, mobIntersectables, playerIntersectables) {
        this.mobs.forEach((currMob) => {
            currMob.update(timeElapsed, worldIntersectables, mobIntersectables, playerIntersectables);
        });
        this.checkRemoveMobs();
    }

    checkRemoveMobs() {
        this.mobsToRemove = [];
        this.mobs.forEach((mob) => {
            if (mob.shouldRemove) {
                this.mobsToRemove.push({ id: mob.id, type: "MOB" });
            }
        });

        this.mobsToRemove.forEach((mob) => {
            this.mobs.delete(mob.id);
        });
        if (this.mobsToRemove.length > 0) {
            this.networkManager.sendRemoveMobsCommand(this.mobsToRemove);
        }
    }

    reset() {
        this.onFightReset.forEach(currHandler => currHandler());
    }

    getCurrentMatchConfig() {
        return this.match;
    }

    /**
     * 
     * @param {function(mob, killerID)} handler 
     */
    addOnMobDeath(handler) {
        this.onMobDeath.push(handler);
    }

    /**
     * @description called on fight reset, currently: on frog respawn
     * @param {function()} handler 
     */
    addOnFightReset(handler) {
        this.onFightReset.push(handler);
    }

    get mobArray() {
        return Array.from(this.mobs.values());
    }

    get mobUpdateData() {
        return Array.from(this.mobs.values());
    }

    get totalMaxHp() {
        var hp = 0;
        this.mobs.forEach((mob) => {
            hp += mob.fightingObject.maxHp;
        });
        return hp;
    }
}

module.exports = MobManager;