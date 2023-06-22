const Stats = require("../../GameStatic/js/gameplay/stats/stats");
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

    /**
     * 
     * @param {Stats} stats 
     * @returns 
     */
    getDamageDealtVisitorsFromStats(stats) {
        const visitors = [];
        stats.stats.forEach((currStat) => {
            if(this.damageDealtStatVisitors.has(currStat.name)) {
                visitors.push(new (this.damageDealtStatVisitors.get(currStat.name))(currStat.getValue()));
            }
        });
        return visitors;
    }

    getDamageReceivedVisitorsFromStats(stats) {
        const visitors = [];
        stats.stats.forEach((currStat) => {
            if(this.damageReceivedStatVisitors.has(currStat.name)) {
                visitors.push(new (this.damageReceivedStatVisitors.get(currStat.name))(currStat.getValue()));
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