const NetworkCommands = require("../../GameStatic/js/network/networkCommands");
const PlayerControls = require("../../GameStatic/js/playerControls");
const HitBox = require("../physics/hitbox");
const Vector = require("../physics/vector");
const SocketUser = require("./socketUser");

const PLAYER_HITBOX_WIDTH = 20;
const PLAYER_HITBOX_HEIGHT = 80;

class Protagonist {

    constructor (id, socket, world, mainLoop) {
        this.id = id;
        this.spd = new Vector(0,0);
        this.acc = new Vector(0,10);
        this.startPos = new Vector(Math.random() * 500,100);
        
        this.world = world;
        this.hitBox = new HitBox(this.startPos.x,this.startPos.y, PLAYER_HITBOX_WIDTH, PLAYER_HITBOX_HEIGHT);
        this.socketUser = new SocketUser(socket, this);

        this.data = {hitBox: this.hitBox, id: this.id};
        this.mainLoop = mainLoop;

        //send world data
        this.socketUser.sendWorldData(world);
    }

    /**
     * 
     * @param {Map} players 
     */
    showOldPlayers(players) {
        var data = [];
        players.forEach((currPlayer)=>{
            data.push(currPlayer.data);
        })
        this.socketUser.showOldPlayers(data);
    }

    /**
     * 
     * @param {number} timeElapsed - timeElapsed since last update 
     * @param {Object[]} intersectables - objects to intersect with
     */
    update(timeElapsed, players) {
        this.spd.addMultipliedVector(this.acc, timeElapsed);

        this.hitBox.pos.x += timeElapsed * this.spd.x;
        if(this.intersecting()) {
            //jconsole.log('Intersecting!');
            this.hitBox.pos.x -= timeElapsed * this.spd.x;
            this.spd.x = 0;
        }

        this.hitBox.pos.y += timeElapsed * this.spd.y;
        if(this.intersecting()) {
            //jconsole.log('Intersecting!');
            this.hitBox.pos.y -= timeElapsed * this.spd.y;
            this.spd.y = 0;
        }

        
    }

    sendUpdate(playerUpdateData) {
        this.socketUser.sendUpdate(playerUpdateData);
    }

    playerControl(control) {
        switch(control) {
            case PlayerControls.START_WALK_RIGHT:
                this.spd.x = 50;
                break;
            case PlayerControls.STOP_WALK_RIGHT:
                this.spd.x = 0;
                break;
            case PlayerControls.START_WALK_LEFT:
                this.spd.x = -50;
                break;
            case PlayerControls.STOP_WALK_LEFT:
                this.spd.x = 0;
                break;
            case PlayerControls.JUMP:
                this.spd.y -= 100;
                break;
        }
        console.log("Handled player control: " + control);
    }


    // Start: Socket


    /**
     * 
     * @param {string} command 
     * @param {Object} data 
     */
    sendCommand(command, data) {
        this.socketUser.sendCommand(command, data);
    }

    /**
     * 
     * @param {Object[]} intersectables 
     */
    intersecting() {
        var intersecting = false;
        this.world.worldObjects.forEach(element => {
            if(element != this && element.isSolid && element.hitBox.intersects(this.hitBox)) {
                intersecting = true;
            }
        });
        return intersecting;
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