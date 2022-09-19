class WeaponManager {
    constructor() {
        this.configFiles = new Map();
    }

    createNewWeapon(classWeapon, owner) {
        const ret = new classWeapon(owner);
        const key = ret.typeData.class + "/" + ret.typeData.subClass + "/" + ret.typeData.type;
        if(!this.configFiles.has(key)) {
            this.configFiles.set(key, require('../../GameplayConfig/Items/Weapons/' + key));
        }
        ret.applyConfig(this.configFiles.get(key));

        return ret;
    }
}

module.exports = WeaponManager;