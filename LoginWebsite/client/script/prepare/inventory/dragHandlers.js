var hotbar = new Hotbar();
var hoverInfos = [];

function onItemFrameDragStarted(event) {
    const srcElement = event.srcElement;
    const id = srcElement.id;
    event.dataTransfer.setData("text/plain", id);
    console.log(id);
    hoverInfos.forEach((currHoverInfo) => {
        currHoverInfo.hide();
    })
}

function onItemFrameDroppedToHotbar(event) {
    event.preventDefault();
    const transDataID = event.dataTransfer.getData("text/plain");
    hotbar.addID(transDataID);
}

function onDragOverHotbar(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function onItemFrameDroppedToInventory(event) {
    event.preventDefault();
    const transDataID = event.dataTransfer.getData("text/plain");
    hotbar.removeID(transDataID);
}

function onDragOverInventory(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

document.onpointermove = ((event) => {
    hoverInfos.forEach((currHoverInfo) => {
        currHoverInfo.updatePos(event.x, event.y);
    })
});