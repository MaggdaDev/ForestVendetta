const ObjectFactory = require("../../../shared/mongoAccess/objectFactory");
const DropObject = require("../../../WebsiteBackend/GameServer/player/dropObject");
const SchedulerMongoAccessor = require("../mongo/schedulerMongoAccessor");
class DropConstructor {

    /**
     * 
     * @param {SchedulerMongoAccessor} schedulerMongoAccessor 
     */
    constructor(schedulerMongoAccessor) {
        this.mongoAccessor = schedulerMongoAccessor;

    }

    /**
     * 
     * @param {DropObject[]} drops - dropObjects from WebsiteBackend/GameServer/player/dropObject
     * @param {string} userID 
     */
    constructDrops(drops, userID) {
        const mongoObjects = [];
        drops.forEach((element) => {
            const mongoItemObject = ObjectFactory.createNewItem(element.itemName, userID);
            mongoObjects.push(mongoItemObject);
            logDropConstructor("Constructed 1 new " + element + " for " + userID);
        });
        logDropConstructor("Constructed " + mongoObjects.length + " items for " + userID + ". Now trying to insert into database...");
        this.mongoAccessor.insertDropsFor(userID, mongoObjects).then(() => {
            logDropConstructor("Insertion of drops for " + userID + " successful.");
        }).catch((error) => {
            logDropConstructor("Insertion of drops for " + userID + " failed!");
            throw error;
        });
    }
}

function logDropConstructor(s) {
    console.log("[DropConstructor] " + s);
}

module.exports = DropConstructor;