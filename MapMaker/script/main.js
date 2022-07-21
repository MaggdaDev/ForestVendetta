var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();
var world = new World();
var polygonBuilder = new PolygonBuilder(canvas, world);
var fileManager = new FileManager(world);
var mouseHandler = new MouseHandler(canvas, world, polygonBuilder);
document.getElementById("saveBtn").addEventListener("click", async function(event) {
    fileManager.saveWorld();
});
document.getElementById("addPolygonForm").addEventListener('reset', (event) => {
    document.getElementById("currRubberPointsLbl").innerHTML = "No rubber points";
});

function addPolygonClicked() {
    polygonBuilder.addPolygonClicked();
    closeAddPolygon();
    return true;
}

function cancelAddPolygonClicked() {
    polygonBuilder.cancelAddPolygon();
    mouseHandler.clearAll();
    world.drawWorld(canvas);
    closeAddPolygon();
    return true;
}

function searchRubberPoint() {
    polygonBuilder.searchRubberPoint();
    closeAddPolygon();
    return true;
}

function cancelAddRubberPointClicked() {
    polygonBuilder.cancelAddRubberPoint();
    closeAddRubberPoint();
    return true;
}

function addRubberPointConfirmed() {
    polygonBuilder.addRubberPointConfirmed();
    closeAddRubberPoint();
    return true;
}

function closeAddPolygon() {
    document.getElementById("addPolygonDialog").close();
}

function closeAddRubberPoint() {
    document.getElementById("addRubberPointDialog").close();
}



