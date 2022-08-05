class ClientMobManager {
    constructor(mainScene) {
        this.mainScene = mainScene;
        this.mobs = new Map();
    }

    spawnMob(data) {
        var mob = ClientMob.fromSpawnCommand(data, this.mainScene);
        this.mobs.set(mob.id, mob);
    }

    updateMobs(data) {
        var instance = this;
        data.forEach((currUpdateData)=>{
            instance.mobs.get(currUpdateData.id).update(currUpdateData);
        });
    }

    removeMob(data) {
        var toRemove = this.mobs.get(data.id);
        this.mobs.delete(data.id);
        toRemove.destroy();
    }

    showOldMobs(data) {
        var instance = this;
        data.forEach((currUpdateData)=>{
            instance.spawnMob(currUpdateData);
        });
    }
}