class Drawer {
    static drawLineFromTo(from, to, canvas) {
        var drawContext = canvas.getContext("2d");
        drawContext.moveTo(from.x, from.y);
        drawContext.lineTo(to.x, to.y);
        drawContext.stroke();   
    }
}