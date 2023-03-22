const Frog = require("../../../../mobs/frog");
const mobConfig = require("../../../../../GameplayConfig/Bosses/frog.json");
const FrogAbilityPerformer = require("../../../../fighting/abilities/mobs/frogAbilityPerformer");
const AbilityPerformerAbstract = require("../../../../fighting/abilities/abilityPerformerAbstract");

test("frog implementing all abilities", () => {
    const testFrog = Frog.prototype;
    Object.getOwnPropertyNames(mobConfig.ability_pool).forEach((currAbilityName) => {
        expect(testFrog[currAbilityName]).toBeDefined();
    });
});

test("frog AI working", () => {
    var jumps = 0;
    jest.mock("../../../../mobs/frog", () => {return class Frog {JUMP_ABILITY() {jumps += 1}}});
    const MockFrog = require("../../../../mobs/frog");
    const testFrog = new MockFrog();
    const testPool = {"JUMP_ABILITY": {execution_time: 1, cooldown: 3, rarity: "COMMON"}};
    const abilityPerformer = new FrogAbilityPerformer(testFrog, testPool, [], "EPIC");
    expect(jumps).toBe(0);
    abilityPerformer.update(0.2);
    expect(jumps).toBe(0);
    abilityPerformer.update(0.2);
    expect(jumps).toBe(1);
    abilityPerformer.update(2);
    abilityPerformer.update(0.1);
    abilityPerformer.update(0.1);
    abilityPerformer.update(0.1);
    abilityPerformer.update(0.1);
    abilityPerformer.update(0.1);
    expect(jumps).toBe(1);
    abilityPerformer.update(2.5);
    expect(jumps).toBe(1);
    abilityPerformer.update(0.1);
    expect(jumps).toBe(2);
    abilityPerformer.update(100);   // finishes ability execution, starting cooldown
    expect(jumps).toBe(2);
    abilityPerformer.update(100);   // finishes cooldown, then add jump to queue
    expect(jumps).toBe(2);
    abilityPerformer.update(0.1);   // execute queue
    expect(jumps).toBe(3);

});