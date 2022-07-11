const HitBox = require("./physics/hitbox");
const Vector = require("./physics/vector");

const PLAYER_HITBOX_WIDTH = 20;
const PLAYER_HITBOX_HEIGHT = 80;

class Protagonist {

    constructor (id, socket) {
        this.id = id;
        this.pos = new Vector(100, 100);
        this.spd = new Vector(0,0);
        this.socket = socket;
        this.data = {pos: this.pos, id: this.id};
        
        this.hitBox = new HitBox(this.pos.x,this.pos.y, PLAYER_HITBOX_WIDTH, PLAYER_HITBOX_HEIGHT);
    }

    /**
     * 
     * @param {number} timeElapsed - timeElapsed since last update 
     * @param {Object[]} intersectables - objects to intersect with
     */
    update(timeElapsed, intersectables) {
        this.pos.x += timeElapsed * this.spd.x;
        this.pos.y += timeElapsed * this.spd.y;

        if(this.intersecting(intersectables)) {
            this.pos.x -= timeElapsed * this.spd.x;
            this.pos.y -= timeElapsed * this.spd.y;
        }

        this.socket.emit('update', this.pos);
        this.socket.emit('updateEnv', intersectables[0].data);
    }

    /**
     * 
     * @param {string} command 
     * @param {Object} data 
     */
    sendCommand(command, data) {
        this.socket.emit(command, data);
    }

    /**
     * 
     * @param {Object[]} intersectables 
     */
    intersecting(intersectables) {
        var intersecting = false;
        intersectables.forEach(element => {
            if(element != this && element.hitBox.intersects(this.hitBox)) {
                intersecting = true;
            }
        });
    }

    /**
    * 
    * @param {Object} event - keyup_right, ...
    */
    keyEvent(event) {
        switch(event) {
            case 'keydown_right':
                this.spd.x = 250;
                break;
            case 'keydown_left':
                this.spd.x = -250;
                break;
            case 'keyup_right':  case 'keyup_left':
                this.spd.x = 0;
                break;
        }
    }

}

module.exports = Protagonist;