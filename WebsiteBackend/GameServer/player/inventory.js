const RustySpade = require("../fighting/swords/heavySwords/rustySpade");

class Inventory {
    constructor() {
        this.backpack = [];
        this.hotBar = Array(6);
        this.selected = 0;  
    }

    loadItems(owner) {   // todo; maybe in constructor better
        this.hotBar[0] = new RustySpade(owner);
        this.hotBar[2] = new RustySpade(owner);
    }

    selectItem(index) {
        this.selected = index;
    }

    get selectedItem() {
        return this.hotBar[this.selected];
    } 
}

module.exports = Inventory;