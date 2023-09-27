const ProjectilesManager = require("../../projectiles/projectilesManager");

test("test projectiles list management", () => {
    const projectilesManager = new ProjectilesManager();
    var counter = 0;
    const mockedProjectile = {
        shouldUpdate: false,
        shouldDestroy: false,
        update: function(timeElapsed) {
            counter += 1;
        }
    }

    projectilesManager.addProjectile(mockedProjectile);
    expect(counter).toBe(0);
    projectilesManager.update(1);
    expect(counter).toBe(0);
    mockedProjectile.shouldUpdate = true;
    projectilesManager.update(1);
    expect(counter).toBe(1);
    mockedProjectile.shouldDestroy = true;
    projectilesManager.update(1);
    expect(counter).toBe(1);
    expect(projectilesManager.projectiles.size).toBe(0);
});