class IDGenerator {
    static _instance;

    constructor() {
        this.counters = {
            games: 0,
            messages: 0,
            items: 0
        }
    }

    nextMessageID() {
        return "M" + this._getAllParts("messages");
    }

    nextGameID() {
        return "G" + this._getAllParts("games");
    }

    nextItemID() {
        return "I" + this._getAllParts("items");
    }

    _getAllParts(key) {
        return this._getAmountPart(key) + "T" + this._timePart + "R" + this._randomPart;
    }

    get _randomPart() {
        return Math.round(Math.random() * 100000);
    }

    _getAmountPart(key) {
        this.counters[key] += 1;
        return this.counters[key] - 1;
    }

    get _timePart() {
        return Date.now();
    }

    static instance() {
        if(IDGenerator._instance === undefined) {
            IDGenerator._instance = new IDGenerator();
        }
        return IDGenerator._instance;
    }
}

module.exports = IDGenerator;