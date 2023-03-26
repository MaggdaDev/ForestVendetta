const RustySpade = require("../items/weapons/swords/heavySwords/rustySpade");
const DropObject = require("../player/dropObject");

class DropHandler {
    constructor(dropConfig) {
        this.dropConfig = dropConfig;
    }

    /**
     * @param {number} modifier
     * @returns {DropObject[]} dropped items
     */
    createDrops(modifier) {
        const droppedItems = [];
        this.dropConfig.drops.forEach((currObj)=> {
            this.performWithProb(()=> {
                droppedItems.push(new DropObject(currObj.item));
            }, currObj.chance * modifier);
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