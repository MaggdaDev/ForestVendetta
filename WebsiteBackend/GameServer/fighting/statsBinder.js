const SimpleAdditionalFlatDamageVisitor = require("./damageProcessing/damageVisitors/simpleAdditionalFlatDamageVisitor");
const SimpleDefenseDamageVisitor = require("./damageProcessing/damageVisitors/simpleDefenseVisitor");

class StatsBinder {
    static _instance;

    constructor() {
        this.damageReceivedStatVisitors = new Map();    // stat name to visitor
        this.damageDealtStatVisitors = new Map();
        this._registerAllDamageReceivedStatVisitors();
        this._registerAllDamageDealtStatVisitors();
    }

    /**
     * @description register visitor classes. I.e.: for stat "damage" create a "SimpleAdditionalFlatDamageVisitor" with damage value as constructor param
     */
    _registerAllDamageDealtStatVisitors() {
        this.damageDealtStatVisitors.set("damage", SimpleAdditionalFlatDamageVisitor);
    }

    _registerAllDamageReceivedStatVisitors() {
        this.damageReceivedStatVisitors.set("defense", SimpleDefenseDamageVisitor);
    }

    getDamageDealtVisitorsFromStats(stats) {
        const visitors = [];
        Object.entries(stats).forEach((keyValueArray) => {
            if(this.damageDealtStatVisitors.has(keyValueArray[0])) {
                visitors.push(new (this.damageDealtStatVisitors.get(keyValueArray[0]))(keyValueArray[1]));
            }
        });
        return visitors;
    }

    getDamageReceivedVisitorsFromStats(stats) {
        const visitors = [];
        Object.entries(stats).forEach((keyValueArray) => {
            if(this.damageReceivedStatVisitors.has(keyValueArray[0])) {
                visitors.push(new (this.damageReceivedStatVisitors.get(keyValueArray[0]))(keyValueArray[1]));
            }
        });
        return visitors;
    }

    /**
     *
     * @returns {StatsBinder}
     */
    static getInstance() {
        if(StatsBinder._instance === undefined) {
            StatsBinder._instance = new StatsBinder();
        }

        return StatsBinder._instance;
    }
}

module.exports = StatsBinder;