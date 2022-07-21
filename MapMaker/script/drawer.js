class Drawer {
    static drawLineFromTo(from, to, canvas) {

        var drawContext = canvas.getContext("2d");
        drawContext.beginPath();
        drawContext.moveTo(from.x, from.y);
        drawContext.lineTo(to.x, to.y);
        drawContext.strokeStyle = "black";
        drawContext.stroke();   
        drawContext.closePath();
    }

    static drawRubberPoint(pos, canvas) {
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "green";
        ctx.fillRect(pos.x-1, pos.y-1, 3, 3);
    }
    static drawRubberLine(gravCenter, pos, canvas) {
        var drawContext = canvas.getContext("2d");
        drawContext.beginPath();
        drawContext.moveTo(gravCenter.x, gravCenter.y);
        drawContext.lineTo(pos.x, pos.y);
        drawContext.strokeStyle = "yellow";
        drawContext.stroke(); 
        drawContext.strokeStyle = "black";
        drawContext.closePath();
    }
}