class ClientPrediction {

    /**
     * 
     * @param {ClientPredictionPoint} startPoint
     */
    static EST_MAX_DIFF = 0.05;
    constructor(startPos) {
        this.pos = new Vector(startPos.x, startPos.y);
        this.spd = new Vector(0,0);
        this.acc = new Vector(0,0);
        this.lastRealPos = this.pos.clone();
        this.lastRealSpd = new Vector(0,0);
        this.lastRealAcc = new Vector(0,0);

        this.lastClientPos = this.pos.clone();
        this.lastClientSpd = new Vector(0,0);

        this.velocityBlended = new Vector(0,0);
        this.pointProjectedClient = new Vector(0,0);
        this.pointProjectedLastReal = new Vector(0,0);
        this.extrapolatedPoint = new Vector(0,0);

        this.dt = 0;
        this.tHat = 0;
    }

   
    getNextClientPos(deltaMs) {
        var delta = deltaMs / 1000.0;
        this.dt += delta;
        this.tHat = this.dt / ClientPrediction.EST_MAX_DIFF;

        this.velocityBlended = Vector.add(this.lastClientSpd, Vector.multiply(Vector.subtractFrom(this.lastRealSpd, this.lastClientSpd), this.tHat));
        this.pointProjectedClient = Vector.add(this.lastClientPos, Vector.add(Vector.multiply(this.velocityBlended, this.dt), Vector.multiply(this.lastRealAcc, 0.5 * this.dt * this.dt)))
        this.pointProjectedLastReal = Vector.add(this.lastRealPos, Vector.add(Vector.multiply(this.lastRealSpd, this.dt), Vector.multiply(this.lastRealAcc, 0.5 * this.dt * this.dt)))
    
        this.extrapolatedPoint = Vector.add(this.lastClientPos, Vector.multiply(Vector.subtractFrom(this.lastRealPos, this.lastClientPos), this.tHat));
        this.spd.setTo(Vector.multiply(Vector.subtractFrom(this.extrapolatedPoint, this.pos), 1.0 / delta));
        this.pos.setTo(this.extrapolatedPoint);
        return this.extrapolatedPoint;
    }
    updateServer(realData) {
        this.lastRealAcc.setTo(realData.acc);
        this.lastRealSpd.setTo(realData.spd);
        this.lastRealPos.setTo(realData.pos);
        this.lastClientPos.setTo(this.pos);
        this.lastClientSpd.setTo(this.spd);
        this.dt = 0;
    }

}