class Item {
    constructor(id) {
        this.id = id;
        this.typeData = {
            name: null,
            subClass: null,
            class: null,
            cathegory: null
        };
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

}

module.exports = Item;