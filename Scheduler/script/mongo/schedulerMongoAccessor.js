const MongoAccessor = require("../../../shared/mongoAccess/mongoAccessor");

class SchedulerMongoAccessor {

    /**
     * 
     * @param {MongoAccessor} mongoAccessor 
     */
    constructor(mongoAccessor) {
        this.mongoAccessor = mongoAccessor;
    } 

    /**
     * 
     * @param {string} userID 
     * @param {Object[]} dropMongoObjects 
     */
    async insertDropsFor(userID, dropMongoObjects) {
        return await this.mongoAccessor.insertOwnedItems(userID, dropMongoObjects);
    }
}

module.exports = SchedulerMongoAccessor;