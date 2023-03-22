const AbilityPerformerAbstract = require("../../../fighting/abilities/abilityPerformerAbstract");


test("inserts right abilities into ability performer", () => {
    const testPool = {
        "a": {}, 
        "b": {}, 
        "c": {
            "rarity": "UNCOMMON"
        },
        "d": {
            "rarity": "EPIC"
        }, 
        "e": {
            "rarity": "RARE"
        }};
    const abilityPerformerAbstract = new AbilityPerformerAbstract(null, testPool, ["b"], "RARE");
    expect(abilityPerformerAbstract.abilities).toEqual({b: testPool.b, c: testPool.c, e: testPool.e});
});