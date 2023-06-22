const Stats = require("../../../../GameStatic/js/gameplay/stats/stats");
const Vector = require("../../../../GameStatic/js/maths/vector");
const SimpleAdditionalFlatDamageVisitor = require("../../../fighting/damageProcessing/damageVisitors/simpleAdditionalFlatDamageVisitor");
const FacadeForFightingObject = require("../../../fighting/facadeForFightingObject");
const FightingObject = require("../../../fighting/fightingObject");

test("Dealing damage with flat additional damage from visitors", () => {
    const testFacade = new FacadeForFightingObject();
    testFacade.getOwnerPosition = ()=> {
        return new Vector(0,0);
    };
    
    const stats = new Stats();
    testFacade.getOwnerStats = () => {
        stats.maxHpStat.setValue(100);
        
        stats.damageStat.setValue(10);
        return stats;
    }

    testFacade.getOwnerPosition();
    const fightingObject1 = new FightingObject(testFacade, 10, 100, "allahId123");
    const fightingObject2 = new FightingObject(testFacade, 10, 100, "fighting22");
    expect(fightingObject1.getCurrentHP()).toBe(100);
    FightingObject.aDamageB(fightingObject2, fightingObject1);
    expect(fightingObject1.getCurrentHP()).toBe(90);
    fightingObject2.addDamageDealtVisitor(new SimpleAdditionalFlatDamageVisitor(7));
    FightingObject.aDamageB(fightingObject2, fightingObject1);
    expect(fightingObject1.getCurrentHP()).toBe(73);
    FightingObject.aDamageB(fightingObject2, fightingObject1);
    expect(fightingObject1.getCurrentHP()).toBe(56);

    fightingObject2.addDamageDealtVisitor(new SimpleAdditionalFlatDamageVisitor(3));
    FightingObject.aDamageB(fightingObject2, fightingObject1);
    expect(fightingObject1.getCurrentHP()).toBe(36);
    
});