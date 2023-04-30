const StatsBinder = require("../../fighting/statsBinder");
const ItemFactory = require("../ItemFactory");
const ArmorPiece = require("./armorPiece");

class ArmorHolder {
    constructor(armorBarList) {
        this.helmet = null;
        this.gloves = null;
        this.armguard = null;
        this.leggings = null;
        this.boots = null;
        this.chestplate = null;

        this.piecesArray = [this.helmet, this.gloves, this.armguard, this.leggings, this.boots, this.chestplate];
        this.damageReceivedVisitors = [];
        this.damageDealtVisistors = [];

        
        armorBarList.forEach((currArmorMongo)=> {
            this._addPieceFromMongo(currArmorMongo);
        });

        this.createVisitors();
        
    }

    getDamageDealtVisitors() {
        return this.damageDealtVisistors;
    }

    getDamageReceivedVisitors() {
        return this.damageReceivedVisitors;
    }

    _addPieceFromMongo(mongoData) {
        const addPiece = ItemFactory.makeItemFromMongoData(mongoData);
        switch(addPiece.getClass()) {
            case "BOOTS":
                this.setBoots(addPiece);
                break; 
            default:
                throw "Unsupported armor class: " + addPiece.getClass();
        }

    }

    setBoots(boots) {
        this.boots = boots;
        this.piecesArray[4] = boots;
    }

    createVisitors() {
        this.piecesArray.forEach((currArmorPiece)=> {
            if(currArmorPiece !== undefined && currArmorPiece !== null) {
                this.createVisitorsFromArmorPiece(currArmorPiece);
            }
        })
    }

    /**
     * 
     * @param {ArmorPiece} armorPiece 
     */
    createVisitorsFromArmorPiece(armorPiece) {
        const statsBinderInstance = StatsBinder.getInstance();
        const armorPieceStats = armorPiece.getStats();
        this.damageDealtVisistors.push(...statsBinderInstance.getDamageDealtVisitorsFromStats(armorPieceStats));
        this.damageReceivedVisitors.push(...statsBinderInstance.getDamageReceivedVisitorsFromStats(armorPieceStats));
    }

    /**
     * Override
     */
    toJSON() {
        return {
            helmet: this.helmet,
            gloves: this.gloves,
            armguard: this.armguard,
            leggings: this.leggings,
            boots: this.boots,
            chestplate: this.chestplate
        }
    }

    
}
module.exports = ArmorHolder;