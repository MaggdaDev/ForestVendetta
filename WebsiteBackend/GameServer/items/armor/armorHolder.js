const PlayerStats = require("../../player/playerStats");
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

        armorBarList.forEach((currArmorMongo) => {
            this._addPieceFromMongo(currArmorMongo);
        });


    }


    _addPieceFromMongo(mongoData) {
        const addPiece = ItemFactory.makeItemFromMongoData(mongoData);
        switch (addPiece.getClass()) {
            case "BOOTS":
                this.setBoots(addPiece);
                break;
            default:
                throw "Unsupported armor class: " + addPiece.getClass();
        }

    }

    /**@description inseerts armor stats into players total stats
     * 
     * @param {PlayerStats} playerStats 
     */
    insertPieceStatsIntoPlayerStats(playerStats) {
        this.piecesArray.forEach((currPiece) => {
            if (currPiece !== null && currPiece !== undefined) {
                playerStats.addArmorPieceStats(currPiece.getStats());
            }
        });
    }

    setBoots(boots) {
        this.boots = boots;
        this.piecesArray[4] = boots;
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