const MongoAccessor = require("../../shared/mongoAccess/mongoAccessor");
class LoginMongoAccessor {
    constructor() {
        this.mongoAccessor = new MongoAccessor();
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