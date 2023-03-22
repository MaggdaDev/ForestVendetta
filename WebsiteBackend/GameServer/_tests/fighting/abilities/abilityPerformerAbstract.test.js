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

test("Ability execution queue with execution time works properly", () => {
    var jumps = 0;
    jest.mock("../../../mobs/frog", () => {return class Frog {JUMP_ABILITY() {jumps += 1}}});
    const MockFrog = require("../../../mobs/frog");
    const testFrog = new MockFrog();
    const testPool = {"JUMP_ABILITY": {execution_time: 1, cooldown: 3, rarity: "COMMON"}};
    const abilityPerformer = new AbilityPerformerAbstract(testFrog, testPool, [], "EPIC");
    expect(jumps).toBe(0);
    abilityPerformer.queueAbility("JUMP_ABILITY");
    abilityPerformer.queueAbility("JUMP_ABILITY");
    abilityPerformer.queueAbility("JUMP_ABILITY");
    abilityPerformer.queueAbility("JUMP_ABILITY");
    abilityPerformer.queueAbility("JUMP_ABILITY");
    expect(jumps).toBe(0);
    abilityPerformer.update(1);
    expect(jumps).toBe(1);
    abilityPerformer.update(0.3);
    expect(jumps).toBe(1);
    abilityPerformer.update(1);
    expect(jumps).toBe(2);
    abilityPerformer.update(1);
    abilityPerformer.update(1);
    abilityPerformer.update(1);
    expect(jumps).toBe(5);
    abilityPerformer.update(1);
    expect(jumps).toBe(5);
});