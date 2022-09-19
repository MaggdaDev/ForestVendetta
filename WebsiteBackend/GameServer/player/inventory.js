const RustySpade = require("../fighting/swords/heavySwords/rustySpade");

class Inventory {
    constructor() {
        this.backpack = [];
        this.hotBar = Array(6);
        this.selected = 0;  
    }

    addDrop(item) {
        for(var i = 0; i < this.hotBar.length; i += 1) {
            if(!this.hotBar[i]) {
                this.hotBar[i] = item;
                return;
            }
        }
    }

    loadItems(owner) {   // todo; maybe in constructor better
        this.hotBar[0] = owner.mainLoop.weaponManager.createNewWeapon(RustySpade, owner);
        this.hotBar[2] = owner.mainLoop.weaponManager.createNewWeapon(RustySpade, owner);
    }

    selectItem(index) {
        this.selected = index;
    }

    get selectedItem() {
        return this.hotBar[this.selected];
    } 
}

module.exports = Inventory;