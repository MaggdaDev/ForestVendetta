const MongoAccessor = require("../../mongoAccess/mongoAccessor");
const ObjectFactory = require("../../mongoAccess/objectFactory");

test("test if default item is added to empty inventories correctly", async () => {
    const mongoAccessor = new MongoAccessor();
    const mockItemCreationMethod = jest.fn();
    ObjectFactory.createDefaultItem = mockItemCreationMethod;
    mockItemCreationMethod.mockReturnValue({
            _id: "defaultItemID",
            ownerDiscordID: "your mom"
        });
    
    const playerObject = {
        _id:"testID",
        inventory: {
            itemIDs: []
        }
    }
    mongoAccessor.itemCollection = {
        insertOne(test) {
            console.log("Inserted");
        }
    }
    mongoAccessor.playerCollection = {
        updateOne(playerID, setObject) {
            console.log("Updated");
            const itemIDs = setObject.$set["inventory.itemIDs"];
            expect(itemIDs[0]).toBe("defaultItemID");
        }
    }
    await mongoAccessor.giveStarterItemIfInventoryEmpty(playerObject);
    expect(playerObject.inventory.itemIDs.length).toBe(1);
    await mongoAccessor.giveStarterItemIfInventoryEmpty(playerObject);
    expect(playerObject.inventory.itemIDs.length).toBe(1);  // dont add 2
    const notEmptyPlayerObject = {
        _id:"testID2",
        inventory: {
            itemIDs: ["not empty"]
        }
    };
    expect(notEmptyPlayerObject.inventory.itemIDs.length).toBe(1);
    await mongoAccessor.giveStarterItemIfInventoryEmpty(notEmptyPlayerObject);
    expect(notEmptyPlayerObject.inventory.itemIDs.length).toBe(1);
});
