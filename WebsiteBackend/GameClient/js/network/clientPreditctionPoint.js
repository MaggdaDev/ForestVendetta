class ClientPredictionPoint {
    constructor(x,y, runtime) {
        this.x = x;
        this.y = y;
        this.runtime = runtime;
    }

    getLinearExtension(nextPoint, runtime) {
        const timeDiff = nextPoint.runtime - this.runtime;
        const nextTimeDiff = runtime - nextPoint.runtime;
        if(timeDiff === 0) {
            return new ClientPredictionPoint(this.x, this.y, runtime);  // new point at same pos but time=now
        }
        const vx = (nextPoint.x - this.x)/timeDiff;
        const vy = (nextPoint.y - this.y)/timeDiff;
        return new ClientPredictionPoint(nextPoint.x + vx * nextTimeDiff, nextPoint.y + vy * nextTimeDiff, runtime);
    }
}