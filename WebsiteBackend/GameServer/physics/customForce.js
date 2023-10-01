class CustomForce {
    getUpdatedForce(timeElapsed, movableBody) {
        throw "Override me!";
    }
}

module.exports = CustomForce;