var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();
var world = new World();
var fileManager = new FileManager(world);
var mouseHandler = new MouseHandler(canvas, world);
document.getElementById("saveBtn").addEventListener("click", async function(event) {
    fileManager.saveWorld();
});


