const PolygonHitBox = require("../../../physics/polygonHitBox");
const FrogTongue = require("../../../projectiles/mobProjectiles/frogTongue");


test("testActivation", () =>  {
    var counter = 0;
    const mockedOwner = {
        pos: {x: 0, y: 0}
    }
    const mockedHittablePlayer = {
        hitBox: new PolygonHitBox([{x:0, y: 100}, {x:100, y:-100}, {x:-100, y:-100}]),
        die: function() {
            counter += 1;
        }
    }
    const tongue = new FrogTongue(mockedOwner, [mockedHittablePlayer]);
    tongue.update(1);
    expect(counter).toBe(0);
    tongue.activate();
    tongue.update(1);
    expect(counter).toBe(1);
});