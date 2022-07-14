class MouseHandler {
    constructor(canvas, world) {
        this.canvas = canvas;
        this.canvas.addEventListener('click', (event)=>{this.onClick(event)});
        this.canvas.addEventListener('mousemove', (event)=>{this.onMove(event)});
        this.currMode = 'POLYGON';
        this.polygonBuilder = new PolygonBuilder(canvas, world);
        this.world = world;
    }

    onClick(event) {
        switch(this.currMode) {
            case 'POLYGON':
                this.polygonBuilder.tryAddClick(event);
            break;
        }
        
    }

    onMove(event) {
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.polygonBuilder.onMouseMove(event);
        this.world.drawWorld(this.canvas);
    }
}