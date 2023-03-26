class ItemBar {
    static MAX_ITEMS = 6;
    constructor(htmlID) {
        this.htmlID = htmlID;
        this.children = document.getElementById(htmlID).children;
        this.htmlObject = document.getElementById(htmlID);
    }

    static isEmpty(toTest) {
        return toTest.children.length > 0
    }

    getSlot(idx) {
        return document.getElementById("hotbarSlot" + idx);
    }

    takeContent() {
        this.contentIDs.forEach((currID, idx) => {
            this.insertIDIntoSlot(currID, idx);
        });
    }

    setCurrContent(ids) {
        this.contentIDs = ids;
    }

    insertIDIntoSlot(id, slotIdx) {
        this.getSlot(slotIdx).appendChild(document.getElementById(id));
    }

    addID(id, idx) {
    
        if (this.contentIDs.length+1 <= ItemBar.MAX_ITEMS) {
            this.contentIDs.push(id);
            console.log("Added ID " + id + " to hotbar.");
            //document.getElementById("hotbarDiv").appendChild(document.getElementById(id));
            this.insertIDIntoSlot(id, idx);
        } else {
            console.log("Too many items in hotbar already!");
        }
        console.log("Now in hotbar: " + this.contentIDs.length + " items.");
    }

    removeID(id) {
        const index = this.contentIDs.indexOf(id);
        if (index > -1) { // only splice array when item is found
            this.contentIDs.splice(index, 1); // 2nd parameter means remove one item only
            console.log("Removed " + id + " from hotbar");
            document.getElementById("inventoryFlexDiv").appendChild(document.getElementById(id));
        } else {
            console.log("ID " + id + " not found in hotbar!");
        }
        console.log("Now in hotbar: " + this.contentIDs.length + " items.");
    }

    toURLParamObjetList() {
        const ret = [];
        this.contentIDs.forEach((currID, index) => {
            ret.push({
                name: "hotbar" + index,
                value: currID
            });
        })
        return ret;
    }
}