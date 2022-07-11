const Protagonist = require('./protagonist');
const Platform = require('./world/platform');
class MainLoop {

    constructor(playerList) {
        console.log("Main Loop created!")
        this.oldTime = Date.now();
        this.lastLog = 0;
        this.timeElapsed = 0;
        this.players = playerList;
        this.intersectables = [new Platform(300, 500, 500, 40)];
    }

    /**
     * 
     * @param {Object} data 
     * @param {number} data.id -  Player id
     * @param {Object} socket - socket object
     */

    /*
    @param {number} timeElapsed - Elapsed time in milliseconds
    */
    update(timeElapsed) {
        var instance = this;
        this.players.forEach(function(player){
            player.update(timeElapsed, instance.intersectables);
        });


    }

    /*
    @param {Object} instance - this instance
    */
    loop(instance) {
        instance.timeElapsed = (Date.now() - instance.oldTime) / 1000.0;
        instance.oldTime = Date.now();
        if (instance.oldTime - instance.lastLog > 3000) {
            instance.lastLog = instance.oldTime;
            console.log("Mainloop running");
        }
        instance.update(instance.timeElapsed);

    }

    start() {
        var self = this
        setInterval(function() {
            self.loop(self);   
        }, 30);
    }

   
    

   
}
module.exports = MainLoop;