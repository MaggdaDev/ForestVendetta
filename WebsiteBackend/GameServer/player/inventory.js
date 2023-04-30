const ItemFactory = require("../items/ItemFactory");
const Weapon = require("../items/weapons/weapon");

class Inventory {
    constructor(hotbarList, owner) {
        this.hotBar = Array(6);
        this.armor = Array(6);
        this.selected = 0;  

        hotbarList.forEach((element, index) => {
            this.hotBar[index] = ItemFactory.makeItemFromMongoData(element, owner);
        });

        this.drops = [];    // list of new acquired drops {itemName: "RUSTY_SPADE"} i.e.

    }
    /**
     * 
     * @param {DropObject} dropObject - detailled info about drop
     * @returns 
     */
    addDrop(dropObject) {
        this.drops.push(dropObject);
        console.log("Added " + dropObject.itemName + " to drops");
    }

    isWeaponSelected() {
        return this.selectedItem instanceof Weapon;
    }

    selectItem(index) {
        this.selected = index;
    }

    get selectedItem() {
        return this.hotBar[this.selected];
    } 
}

module.exports = Inventory;