const ItemFactory = require("../../items/ItemFactory");

test("Item factory creating items from mongo right", () => {
    const testOwner = {"fightingObject": {}};
    console.log(__dirname);
    console.log("hello");
    ItemFactory.WEAPONS_CONFIG_PATH = "WebsiteBackend/" + ItemFactory.WEAPONS_CONFIG_PATH;
    ItemFactory.ARMOR_CONFIG_PATH = "WebsiteBackend/" + ItemFactory.ARMOR_CONFIG_PATH;
    const testSpade = ItemFactory.makeItemFromMongoData({"itemName": "RUSTY_SPADE", "_id":"testID123"}, testOwner);
    expect(testSpade.getCathegory()).toBe("WEAPON");
});