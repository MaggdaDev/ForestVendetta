const RustySpade = require("../fighting/swords/heavySwords/rustySpade");
const DropObject = require("../player/dropObject");

class DropHandler {
    constructor(dropConfig, weaponManager) {
        this.weaponManager = weaponManager;
        this.dropConfig = dropConfig;
    }

    /**
     * 
     * @returns {DropObject[]} dropped items
     */
    createDrops() {
        const droppedItems = [];
        this.dropConfig.drops.forEach((currObj)=> {
            this.performWithProb(()=> {
                droppedItems.push(new DropObject(currObj.item));
            }, currObj.chance);
        });
        return droppedItems;
    }

    performWithProb(func, prob) {
        if(Math.random() < prob) {
            return func();
        }
    }
}

module.exports = DropHandler;