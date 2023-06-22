const Stats = require("../../../../GameStatic/js/gameplay/stats/stats");
const Vector = require("../../../../GameStatic/js/maths/vector");
const FacadeForFightingObject = require("../../../fighting/facadeForFightingObject");
const FightingObject = require("../../../fighting/fightingObject");

test("Basic damaging works", () => {
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
    const fightingObject1 = new FightingObject(testFacade, "allahId123");
    const fightingObject2 = new FightingObject(testFacade, "fighting22");
    expect(fightingObject1.getCurrentHP()).toBe(100);
    FightingObject.aDamageB(fightingObject2, fightingObject1);
    expect(fightingObject1.getCurrentHP()).toBe(90);
    
});