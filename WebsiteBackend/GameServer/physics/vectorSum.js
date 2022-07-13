const ComputingVector = require("./computingVector");

class VectorSum extends ComputingVector {
    constructor() {
        super(0,0,()=>{return this.sumX();}, ()=>{return this.sumY();});
        this.vectors = new Set();
    }

    addVector(vec) {
        this.vectors.add(vec);
    }

    /**
     * 
     * @param {Vector} vec - EXACT object to remove 
     */
    removeVector(vec) {
        this.vectors.delete(vec);
    }

    sumX() {
        var ret = 0;
        this.vectors.forEach((vec)=>{
            ret += vec.x;
        });
        return ret;
    }

    sumY() {
        var ret = 0;
        this.vectors.forEach((vec)=>{
            ret += vec.y;
        });
        return ret;
    }
}

module.exports = VectorSum;