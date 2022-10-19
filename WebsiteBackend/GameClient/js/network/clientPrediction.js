class ClientPrediction {

    /**
     * 
     * @param {ClientPredictionPoint} startPoint
     */
    constructor() {
        this.lastPoints = [];
    }

    addRealPoint(point) {
        if (this.lastPoints.length >= 2) {
            this.lastPoints.shift();
        }
        this.lastPoints.push(point);
    }

    getNext(runtime) {
        if(this.lastPoints.length === 0) {
            return null;
        }
        if(this.lastPoints.length === 1) {
            return this.lastPoints[0];
        }
        return this.lastPoints[0].getLinearExtension(this.lastPoints[1], runtime);
    }
}