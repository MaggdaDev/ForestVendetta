const HitBox = require("../physics/hitbox");
const Protagonist = require("../player/protagonist");
class Projectile {
    static PROJECTILE_TYPES = {
        FROG_TONGUE: "FROG_TONGUE"
    }
    /**
     * 
     * @param {*} owner 
     * @param {*} hitBox 
     * @param {string} type projectile type for client. See ClientProjectileManager's dict to see options
     */
    constructor(owner, hitBox, type) {
        if(type === undefined) throw "Type is mandatory for projectiles.";
        this.type = type;
        this.owner = owner;
        this.hitBox = hitBox;

        this._onUpdate = [];
        this._hittableObjects = [];
        this._onObjectHit = null;

        this.isRemoveHitListenerOnHit = true;
        this.shouldUpdate = true;
        this.shouldRender = true;
        this.shouldDestroy = false;
        this.isAlive = false;   // should projectile be updated + hitting?
    }

    

    addOnUpdate(onUpdate) {
        this._onUpdate.push(onUpdate);
    }

    destroy() {
        this.shouldDestroy = true;
        this.shouldRender = false;
        this.shouldUpdate = false;
    }

    update(timeElapsed) {
        if (this.isAlive) {


            for (var curr of this._onUpdate) {
                curr(timeElapsed);
            }

            const hits = this.findCollidingObjects(this._hittableObjects);
            if (hits.length > 0) {
                this._onObjectHit(hits);
                if (this.removeHitListenerOnHit) {
                    this.setHitListener();
                }
            }
        }
    }

    /**
     * @description setup listener to be called, when one of the objects is hit. undefinable: setHitListener() removes hitListener
     * @param {*} hittableObjects list of objects that have the attribute object.hitBox
     * @param {*} onHit func(hitObjects[])
     */
    setHitListener(hittableObjects, onHit) {
        if (hittableObjects === undefined || onHit === undefined) {
            this._hittableObjects = [];
            this._onObjectHit = null;
            return;
        }
        this._hittableObjects = hittableObjects;
        this._onObjectHit = onHit;
    }


    /**
     * 
     * @param {*} objectList list of objects that have an object.hitBox property and a object.isInteractable property
     */
    findCollidingObjects(objectList) {
        let retList = [];
        objectList.forEach((currObj) => {
            if (currObj.hitBox === undefined) {
                console.error("Object without hitbox given: " + currObj);
                return;
            }
            if (!currObj.isInteractable) {
                return;
            }
            if (HitBox.intersects(currObj.hitBox, this.hitBox)) {
                retList.push(currObj);
            }

        });
        return retList;
    }

    /**
     * 
     * @param {Object} modifyableJson 
     * @returns none!
     */
    extendJson(modifyableJson) {
        // override me!
    }

    toJSON() {
        if(this.id === undefined) {
            console.error("JSONing projectile without ID!");
        }
        const ret = {
            id: this.id,
            type: this.type,
            shouldRender: this.shouldRender
        }
        this.extendJson(ret);
        return ret;
    }
}

module.exports = Projectile;