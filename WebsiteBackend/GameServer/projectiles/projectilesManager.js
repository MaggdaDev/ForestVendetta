
class ProjectilesManager {

    

    constructor() {
        this.currIdCounter = -1;
        this.projectiles = new Map();
    }

    update(timeElapsed) {
        // test for destroy
        this.projectiles.forEach((value, key) => {
            if (this.projectiles.get(key).shouldDestroy) {
                console.log("Removed projectile with key " + key);
                this.projectiles.delete(key);
            }
        });

        // update remaining
        this.projectiles.forEach((currProj) => {
            if (currProj.shouldUpdate) {
                currProj.update(timeElapsed);
            }
        });
    }

    nextProjectileID() {
        this.currIdCounter += 1;
        return "P" + this.currIdCounter + "R" + Math.round(Math.random() * 1000);
    }

    /**
     * @description automatically removes projectile on next update, when projectile.shouldDestroy === true
     * @param {Projectile} projectile 
     */
    addProjectile(projectile) {
        if (projectile.id !== undefined) {
            console.error("Projectile that already has ID added!");
        } else {
            projectile.id = this.nextProjectileID();
        }
        if (this.projectiles.has(projectile.id)) {
            throw "Projectile with id " + projectile.id + " duplicate added!";
        }
        this.projectiles.set(projectile.id, projectile);
    }

    get projectilesUpdateData() {
        const ret = [];
        this.projectiles.forEach((proj) => {
            ret.push(proj.toJSON());
        })
        return ret;
    }

}

module.exports = ProjectilesManager;