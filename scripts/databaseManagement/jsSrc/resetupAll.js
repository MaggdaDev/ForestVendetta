const mainDatabaseName = "forestvendetta";
db = db.getSiblingDB(mainDatabaseName);
db.dropDatabase();
console.log("Dropped database: " + mainDatabaseName);

// create players databse
const playersDBName = "players";
db.createCollection(playersDBName, {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            title: "Player Object Validation",
            required: ["discordID", "accountLevel"],
            properties: {
                discordID: {
                    bsonType: "string"
                },
                accountLevel: {
                    bsonType: "int",
                    minimum: 1
                }
            }
        }
    }
});
console.log("Created collections: " + playersDBName);