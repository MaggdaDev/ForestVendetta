class Timer {
    constructor(duration, onFinished) {
        this.timer = 0;
        this.duration = duration;
        this.onFinished = onFinished;
        this.isRunning = false;
    }

    setDuration(duration) {
        this.duration = duration;
    }

    setOnFinished(onFinished) {
        this.onFinished = onFinished;
    }

    start() {
        this.timer = 0;
        this.isRunning = true;
    }

    stop() {
        this.isRunning = false;
    }

    update(timeElasped) {
        if (this.isRunning) {
            this.timer += timeElasped;
            if (this.timer >= this.duration) {
                this.stop();
                this.onFinished();
            }
        }
    }
}

if (typeof module !== 'undefined') {
    module.exports = Timer;
}