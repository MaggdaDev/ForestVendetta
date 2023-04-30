var hoverInfos = [];
globalItemConfigMap = null;
itemData = new Map();
currentlyDraggedID = "";
// item to conatainer
const itemToContainerMap = new Map();
function setInItemToContainerMap(id, containerID) {
    itemToContainerMap.set(id, containerID);
    console.log("Updated id " + id.toString() + " to container " + containerID);
}
const CONTAINERS = {
    INVENTORY: "INVENTORY",
    HOTBAR: "HOTBAR",
    ARMORBAR: "ARMORBAR"
}

var hotbar = new ItemBar("hotbarDiv", CONTAINERS.HOTBAR, ["ARMOR"], false);
var armorBar = new ItemBar("armorDiv", CONTAINERS.ARMORBAR, ["ARMOR"], true);
const inventoryDiv = document.getElementById("inventoryFlexDiv");



function itemToContainerOk(itemID, bar) {
    const currItem = itemData.get(itemID);
    currItemConfig = globalItemConfigMap.get(currItem.itemName);
    if (bar.willAcceptItem(currItem, currItemConfig)) {
        return true;
    } else {
        return false;
    }

}

function onItemFrameDragStarted(event) {
    resetDropOks();
    const srcElement = event.srcElement;
    const id = srcElement.id;
    event.dataTransfer.setData("text/plain", id);
    console.log(id);
    hoverInfos.forEach((currHoverInfo) => {
        currHoverInfo.hide();
    })
    currentlyDraggedID = id;
}

function onItemFrameDroppedToHotbar(event, idx) {
    resetDropOks();
    event.preventDefault();
    const transDataID = event.dataTransfer.getData("text/plain");
    if (itemToContainerOk(transDataID, hotbar)) {
        _removeItemFromCurrentContainer(transDataID);
        hotbar.addID(transDataID, idx);
    } else {
        console.log("NOT OKEYDOKEY!");
    }
}

function onItemFrameDroppedToArmorBar(event, idx) {
    event.preventDefault();
    resetDropOks();
    const transDataID = event.dataTransfer.getData("text/plain");
    if (itemToContainerOk(transDataID, armorBar)) {
        _removeItemFromCurrentContainer(transDataID);

        armorBar.addID(transDataID, idx);
    } else {
        console.log("NOT OKEYDOKEY");
    }
}

function onDragOverContainer(event, containerID) {
    resetDropOks();
    event.preventDefault();
    var affectedContainer;
    if(containerID === CONTAINERS.ARMORBAR) {
        affectedContainer = armorBar;
    } else if(containerID === CONTAINERS.HOTBAR) {
        affectedContainer = hotbar;
    } else {
        throw "Not supported container type: " + containerID;
    }
    if (itemToContainerOk(currentlyDraggedID, affectedContainer)) {
        event.dataTransfer.dropEffect = "move";
        affectedContainer.dropOk();
    } else {
        event.dataTransfer.dropEffect = "none";
        affectedContainer.dropNotOk();
    }
}


function onItemFrameDroppedToInventory(event) {
    resetDropOks();
    event.preventDefault();
    const transDataID = event.dataTransfer.getData("text/plain");
    _removeItemFromCurrentContainer(transDataID);
    setInItemToContainerMap(transDataID, CONTAINERS.INVENTORY);
}

function resetDropOks() {
    hotbar.dropUsual();
    armorBar.dropUsual();
    
    inventoryDiv.classList.remove("okForDrag");
    inventoryDiv.classList.remove("notForDrag");
}

function _removeItemFromCurrentContainer(itemID) {
    switch (itemToContainerMap.get(itemID)) {
        case CONTAINERS.ARMORBAR:
            armorBar.removeID(itemID);
            break;
        case CONTAINERS.HOTBAR:
            hotbar.removeID(itemID);
            break;
    }
}

function onDragOverInventory(event) {
    resetDropOks();
    inventoryDiv.classList.add("okForDrag");
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

document.onpointermove = ((event) => {
    hoverInfos.forEach((currHoverInfo) => {
        currHoverInfo.updatePos(event.x, event.y);
    })
});