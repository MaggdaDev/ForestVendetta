class Stat {
    /**
     * 
     * @param {*} name 
     * @param {*} value
     */
    constructor(name, value) {
        this.name = name;
        this._value = value;
    }

    /**
     * 
     * @param {Stat} statToAdd 
     */
    addToMe(statToAdd) {
        this._value += statToAdd._value;
    }

    setValue(val) {
        this._value = val;
    }

    getValue() {
        return this._value;
    }

    toString() {
        return this.name + " " + this.getValue();
    }
}
if (typeof module !== 'undefined') {
    module.exports = Stat;
}