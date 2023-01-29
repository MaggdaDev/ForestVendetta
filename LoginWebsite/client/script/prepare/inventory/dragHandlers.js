var hotbar = new Hotbar();

function onItemFrameDragStarted(event) {
    const srcElement = event.srcElement;
    const id = srcElement.id;
    event.dataTransfer.setData("text/plain", id);
    console.log(id);
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