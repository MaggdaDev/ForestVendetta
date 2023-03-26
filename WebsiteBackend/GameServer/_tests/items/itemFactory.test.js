const ItemFactory = require("../../items/ItemFactory");

test("Item factory creating items from mongo right", () => {
    const testOwner = {"fightingObject": {}};
    const testSpade = ItemFactory.makeItemFromMongoData({"itemName": "RUSTY_SPADE", "_id":"testID123"}, testOwner);
    expect(testSpade.getCathegory()).toBe("WEAPON");
});