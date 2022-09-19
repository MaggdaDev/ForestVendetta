const RustySpade = require("../fighting/swords/heavySwords/rustySpade");

class DropHandler {
    constructor(dropConfig, weaponManager) {
        this.weaponManager = weaponManager;
        this.dropConfig = dropConfig;
    }

    createDrops(owner) {
        const droppedItems = [];
        this.dropConfig.drops.forEach((currObj)=> {
            this.performWithProb(()=> {
                droppedItems.push(this.dropWeapon(currObj.item, owner));
            }, currObj.chance);
        });
        return droppedItems;
    }

    dropWeapon(item, owner) {
        switch(item) {
            case "RUSTY_SPADE":
            return this.weaponManager.createNewWeapon(RustySpade, owner)
            break;
            default:
                throw ("Item not supported as drop yet: " + item);
        }
    }

    performWithProb(func, prob) {
        if(Math.random() < prob) {
            return func();
        }
    }
}

module.exports = DropHandler;