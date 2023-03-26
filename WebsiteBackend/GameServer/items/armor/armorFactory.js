class ArmorPieceFactory {
    static instance = null;
    
    /**
     * 
     * @param {Object} mongoData 
     */
    static makeArmorPieceFromMongoData(mongoItemData) {
        const weaponID = mongoItemData._id;
        const itemName = mongoItemData.itemName;
        switch(itemName) {
            
        }
    }

    static get instance() {
        if(ArmorPieceFactory.instance === null) {
            ArmorPieceFactory.instance = new ArmorPieceFactory();
        }
        return ArmorPieceFactory.instance;
    }

}

module.exports = ArmorPieceFactory;