class BossSpawnedMessage {
    constructor(displayName, adress) {
        this.content = "A " + displayName + " has appeared! Click here to fight it: " + adress;
    }
}

module.exports = BossSpawnedMessage;