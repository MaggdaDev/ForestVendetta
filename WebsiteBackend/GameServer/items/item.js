
class Item {

    /**
     * @param {Protagonist} owner
     * @param {string} id
     */
    constructor(owner, id) {
        this.id = id;
        this.typeData = {
            name: null,
            subClass: null,
            class: null,
            cathegory: null
        };
        this.owner = owner;
    }

    applyConfig(config) {
        throw "Apply config not overridden!";
    }

    setName(n) {
        this.typeData.name = n;
    }

    setSubClass(s) {
        this.typeData.subClass = s;
    }

    setClass(c) {
        this.typeData.class = c;
    }
    setCathegory(c) {
        this.typeData.cathegory = c;
    }
    
    getCathegory() {
        return this.typeData.cathegory;
    }

    getName() {
        return this.typeData.name;
    }

    getClass() {
        return this.typeData.class;
    }

}

module.exports = Item;