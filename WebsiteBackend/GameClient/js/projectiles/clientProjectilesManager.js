class ClientProjectilesManager {
    
    constructor(mainScene) {
        this.clientProjectilesMap = new Map();
        this.mainScene = mainScene;
        this.typeToClassDict = {
            FROG_TONGUE: ClientFrogTongue
        }
    }

    updateProjectiles(projectilesList) {
        const stillAliveIDs = [];
        var isSync = true;
        projectilesList.forEach((currProjectile) => {
            if (currProjectile.id === undefined) {
                console.error("Projectile with undefined ID!");
            } else {
                stillAliveIDs.push(currProjectile.id);
                var isSync = true;
                if (this.clientProjectilesMap.has(currProjectile.id)) {
                    this.clientProjectilesMap.get(currProjectile.id).updateServer(currProjectile);
                } else {
                    isSync = false;
                    this.clientProjectilesMap.set(currProjectile.id, this.generateProjectile(currProjectile));
                }
            }
        });

        if ((!isSync) || this.clientProjectilesMap.size !== projectilesList.length) {
            console.log("Resyncing projectiles lists: client has " + this.clientProjectilesMap.size + " while server has " + projectilesList.length);
            this.clientProjectilesMap.forEach((currProj, currKey) => {
                if(!stillAliveIDs.includes(currKey)) {
                    console.log("Deleting projectile with ID " + currKey);
                    removeProjectile(currKey);
                }
            });
        }
    }

    generateProjectile(projectileData) {
        if(this.typeToClassDict[projectileData.type] === undefined) {
            throw "Unimplemented projectile type: " + projectileData.type;
        }
        const proj = new this.typeToClassDict[projectileData.type] (this.mainScene);

        return proj;
    }

    removeProjectile(projID) {
        this.clientProjectilesMap.get(projID).destroy();
        this.clientProjectilesMap.delete(projID);
    }
}