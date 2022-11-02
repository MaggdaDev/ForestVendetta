const mainDatabaseName = "forestvendetta";
db = db.getSiblingDB(mainDatabaseName);
db.dropDatabase();
console.log("Dropped database: " + mainDatabaseName);

// create players collection
const playersDBName = "players";
db.createCollection(playersDBName, {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            title: "Player Object Validation",
            required: ["discordID", "accountLevel", "inventory"],
            properties: {
                discordID: {
                    bsonType: "string"
                },
                accountLevel: {
                    bsonType: "int",
                    minimum: 1
                }, 
                inventory: {    
                    bsonType: "array"           // ARRAY OF UNIQUE _IDs OF WEAPONS
                }
            }
        }
    }
});
console.log("Created collections: " + playersDBName);

// create items collection
const itemsDBName = "items";
db.createCollection(playersDBName, {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            title: "Items Object Validation",
            required: ["type", "ownerDiscordID"],
            properties: {
                ownerDiscordID: {           // UNIQUE LINK TO: PLAYERS
                    bsonType: "string"
                },
                type: {
                    bsonType: "string"
                }
            }
        }
    }
});
console.log("Created collections: " + playersDBName);