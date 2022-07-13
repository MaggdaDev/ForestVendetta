const NetworkCommands = require("../../GameStatic/js/network/networkCommands");
const PlayerControls = require("../../GameStatic/js/playerControls");
const HitBox = require("../physics/hitbox");
const MovableBody = require("../physics/movableBody");
const Vector = require("../physics/vector");
const SocketUser = require("./socketUser");

const PLAYER_HITBOX_WIDTH = 20;
const PLAYER_HITBOX_HEIGHT = 80;

class Protagonist {

    constructor (id, socket, world, mainLoop) {
        this.id = id;
        this.startPos = new Vector(Math.random() * 500,100);
        
        this.world = world;
        this.hitBox = new HitBox(this.startPos.x,this.startPos.y, PLAYER_HITBOX_WIDTH, PLAYER_HITBOX_HEIGHT);
        this.socketUser = new SocketUser(socket, this);

        this.data = {hitBox: this.hitBox, id: this.id};
        this.mainLoop = mainLoop;

        this.movableBody = new MovableBody(this.hitBox,false,100);
        this.movableBody.addGravity();
        //this.movableBody.addFriction();
        this.walkAcc = null;
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
        this.movableBody.update(timeElapsed, this.intersectables);   
    }

    get intersectables() {
        return this.world.intersectables;
    }

    sendUpdate(updateData) {
        this.socketUser.sendUpdate(updateData);
    }

    playerControl(control) {
        switch(control) {
            case PlayerControls.START_WALK_RIGHT:
                this.startWalk('RIGHT');
                break;
            case PlayerControls.STOP_WALK_RIGHT:
                this.clearCurrAccImpulse();
                break;
            case PlayerControls.START_WALK_LEFT:
                this.startWalk('LEFT');
                break;
            case PlayerControls.STOP_WALK_LEFT:
                this.clearCurrAccImpulse();
                break;
            case PlayerControls.JUMP:
                this.jump();
                break;
        }
        console.log("Handled player control: " + control);
    }

    /**
     * 
     * @param {string} dir - 'LEFT' or 'RIGHT' 
     */
    startWalk(dir) {
        this.clearCurrAccImpulse();
        var dirVec;
        if(dir === 'RIGHT') {
            dirVec = new Vector(1,0);
        } else if(dir === 'LEFT') {
            dirVec = new Vector(-1,0);
        } else {
            throw new Error('dir must be either LEFT or RIGHT');
        }
        this.walkAcc = this.movableBody.generateAccelerateImpulse(dirVec, 50, 100);
    }

    jump() {

    }

    clearCurrAccImpulse() {
        if(this.walkAcc) {
            this.movableBody.removeAcceleration(this.walkAcc);
            this.walkAcc = null;
        }
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