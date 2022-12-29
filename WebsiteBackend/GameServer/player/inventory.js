const RustySpade = require("../fighting/swords/heavySwords/rustySpade");
const WeaponManager = require("../fighting/weaponManager");

class Inventory {
    constructor(hotbarList, owner) {
        this.hotBar = Array(6);
        this.selected = 0;  

        hotbarList.forEach((element, index) => {
            this.hotBar[index] = WeaponManager.instance().fromMongoData(element, owner);
        });

    }

    addDrop(item) {
        for(var i = 0; i < this.hotBar.length; i += 1) {
            if(!this.hotBar[i]) {
                this.hotBar[i] = item;
                return;
            }
        }
    }

    selectItem(index) {
        this.selected = index;
    }

    get selectedItem() {
        return this.hotBar[this.selected];
    } 
}

module.exports = Inventory;