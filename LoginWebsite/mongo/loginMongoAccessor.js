const MongoAccessor = require("../../shared/mongoAccess/mongoAccessor");
class LoginMongoAccessor {
    constructor() {
        this.mongoAccessor = new MongoAccessor();
    }

    async createHotbarObject(userID, mongoInventoryObject) {
        const hotbarIDs = await this.getCheckedHotbarIDs(userID, mongoInventoryObject);
        const hotbarItems = await this.getItemObjectsFromIDs(hotbarIDs);
        console.log("Created hotbar Object.");
        return hotbarItems;
    }

    async getItemObjectsFromIDs(itemIDs) {      // for hotbar construction i.e.
        return await this.mongoAccessor.getItemObjectsFromIDs(itemIDs);
    }

    async getCheckedHotbarIDs(userID, mongoInventoryObject) {
        const hotbarIDs = mongoInventoryObject.hotbarIDs;
        const ownedIDs = mongoInventoryObject.itemIDs;
        var modified = false;
        const idxToRemove = [];
        hotbarIDs.forEach((element, index) => {
            if (!ownedIDs.includes(element)) {
                idxToRemove.push(index);
                console.log("Found ERROR! Following item is in hotbar but not owned: " + element);
            }
        });
        idxToRemove.forEach((idx) => {
            hotbarIDs.splice(idx, 1);
            modified = true;
        });

        if (modified) {          // DATABASE ACCESS: REWRITE WITHOUT ERROR
            await this.mongoAccessor.updateHotbar(userID, hotbarIDs);
        } else {

            console.log("Checked hotbar; no error");
            
        }

        return hotbarIDs;
    }

    async getPlayerOrCreate(userID) {
        return this.mongoAccessor.getPlayerOrCreate(userID);
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.mongoAccessor.connect().then(resolve);
        })
    }


}

module.exports = LoginMongoAccessor;