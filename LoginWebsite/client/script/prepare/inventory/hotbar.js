class Hotbar {
    static MAX_ITEMS = 6;
    takeContent() {
        this.contentIDs.forEach((currID) => {
            document.getElementById("hotbarDiv").appendChild(document.getElementById(currID));
        });
    }

    setCurrContent(ids) {
        this.contentIDs = ids;
    }

    addID(id) {
        if (this.contentIDs.length+1 <= Hotbar.MAX_ITEMS) {
            this.contentIDs.push(id);
            console.log("Added ID " + id + " to hotbar.");
            document.getElementById("hotbarDiv").appendChild(document.getElementById(id));
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