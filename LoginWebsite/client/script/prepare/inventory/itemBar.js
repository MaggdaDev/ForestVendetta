class ItemBar {
    static MAX_ITEMS = 6;
    constructor(htmlID, containerID, cathegoryList, whitelistMode) {
        this.htmlID = htmlID;
        this.children = document.getElementById(htmlID).children;
        this.htmlObject = document.getElementById(htmlID);
        this.containerID = containerID;
        this.cathegoryList = cathegoryList;
        this.whitelistMode = whitelistMode;
    }

    static isEmpty(toTest) {
        return toTest.children.length > 0
    }

    getSlot(idx) {
        return document.getElementById(this.htmlID + "_SLOT" + idx);
    }

    takeContent() {
        this.contentIDs.forEach((currID, idx) => {
            this.insertIDIntoSlot(currID, idx);
        });
    }

    setCurrContent(ids) {
        this.contentIDs = ids;
        this.contentIDs.forEach((currID) => {
            setInItemToContainerMap(currID, this.containerID);
        });
    }

    insertIDIntoSlot(id, slotIdx) {
        if(!this.isSlotEmpty(slotIdx)) {
            for(var i = 0; i < ItemBar.MAX_ITEMS; i += 1) {
                if(this.isSlotEmpty(i)) {
                    return this.insertIDIntoSlot(id, i);
                }
            }
        } else {
            this.getSlot(slotIdx).appendChild(document.getElementById(id));
            return true;
        }
        return false;
        
    }

    isSlotEmpty(slotIdx) {
        if(this.getSlot(slotIdx).children.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    addID(id, idx) {
    
        if (this.contentIDs.length+1 <= ItemBar.MAX_ITEMS) {
            this.contentIDs.push(id);
            console.log("Added ID " + id + " to bar: " + this.htmlID);
            this.insertIDIntoSlot(id, idx);
            setInItemToContainerMap(id, this.containerID);
        } else {
            console.log("Too many items in " + this.htmlID + " already!");
        }
        console.log("Now in " + this.htmlID + ": " + this.contentIDs.length + " items.");

        this.dropUsual();
    }

    removeID(id) {
        const index = this.contentIDs.indexOf(id);
        if (index > -1) { // only splice array when item is found
            this.contentIDs.splice(index, 1); // 2nd parameter means remove one item only
            console.log("Removed " + id + " from hotbar");
            document.getElementById("inventoryFlexDiv").appendChild(document.getElementById(id));
        } else {
            console.log("ID " + id + " not found in " + this.htmlID + "!");
        }
        console.log("Now in " + this.htmlID + ": " + this.contentIDs.length + " items.");
    }

    willAcceptItem(item, itemConfig) {
        if(this.contentIDs.length >= ItemBar.MAX_ITEMS) {
            return false;
        }
        if(this.whitelistMode) {
            if(this.cathegoryList.includes(itemConfig.cathegory)) {
                return true;
            } else {
                return false;
            }
        } else {
            if(this.cathegoryList.includes(itemConfig.cathegory)) {
                return false;
            } else {
                return true;
            }
        }
    }

    /**
     * @description animation for accepting a drop
     */
    dropOk() {
        this.htmlObject.classList.add("okForDrag");
        
    }

    /**
     * @description animation for accepting a drop
     */
    dropNotOk() {
        this.htmlObject.classList.add("notOkForDrag");
    }

    /**
     * @description animation for accepting a drop
     */
    dropUsual() {
        this.htmlObject.classList.remove("notOkForDrag");
        this.htmlObject.classList.remove("okForDrag");
    }

    toURLParamObjectList() {
        const ret = [];
        this.contentIDs.forEach((currID, index) => {
            ret.push({
                name: this.containerID + index,
                value: currID
            });
        });
        console.log("Ret: " + ret.toString())
        return ret;
    }
}