function onItemFrameDragStarted(event) {
    const srcElement = event.srcElement;
    const id = srcElement.id;
    console.log(id);
}

function onItemFrameDroppedToHotbar(event) {
    const srcElement = event.srcElement;
    const id = srcElement.id;
    console.log(id);

    document.getElementById("hotbarDiv").appendChild(document.getElementById(id));
}