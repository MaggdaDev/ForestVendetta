class Randomizer {
    /**
     * 
     * @param {function()} callback
     * @param {number} prob - 0 <= prob <= 1, probabitlity to execute handler 
     */
    executeWithProb(callback, prob) {
        if(Math.random() < prob) {
            callback();
        }
    }
}

module.exports = Randomizer;