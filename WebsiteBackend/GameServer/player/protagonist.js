const NetworkCommands = require("../../GameStatic/js/network/networkCommands");
const PlayerControls = require("../../GameStatic/js/playerControls");
const HitBox = require("../physics/hitbox");
const MovableBody = require("../physics/movableBody");
const Vector = require("../physics/vector");
const SocketUser = require("./socketUser");
const PolygonHitBox = require("../physics/polygonHitBox");
const FightingObject = require("../fighting/fightingObject");

const PLAYER_HITBOX_WIDTH = 25;
const PLAYER_HITBOX_HEIGHT = 100;

class Protagonist {
    static JUMP_FORCE = 50000;
    static DAMAGE = 5;
    static HP = 25;
    constructor(id, socket, world, mainLoop) {
        this.id = id;
        this.startPos = new Vector(Math.random() * 500, 100);

        this.world = world;
        this.hitBox = PolygonHitBox.fromRect(this.startPos.x, this.startPos.y, PLAYER_HITBOX_WIDTH, PLAYER_HITBOX_HEIGHT);
        this.socketUser = new SocketUser(socket, this);

        this.mainLoop = mainLoop;

        //physics
        this.movableBody = new MovableBody(this.hitBox, 100, this, "P" + id);
        this.movableBody.addGravity();
        this.movableBody.disableRotation();

        //send world data
        this.socketUser.sendWorldData(world);

        this.wantGo = "NONE";
        var instance = this;
        this.movableBody.addOnNewContact(()=>{
            if(instance.wantGo !== "NONE") {
                instance.startWalk(instance.wantGo);
            }
        });
        this.movableBody.wayOutPriority = 100;
        this.movableBody.adjustJumpData({jumpForce: Protagonist.JUMP_FORCE});
        this.movableBody.setProtagonist();

        //Fighting
        this.fightingObject = new FightingObject(Protagonist.DAMAGE, Protagonist.HP);
    }

    /**
     * 
     * @param {Map} players 
     */
    showOldPlayers(players) {
        var data = [];
        players.forEach((currPlayer) => {
            data.push(currPlayer);
        })
        this.socketUser.showOldPlayers(data);
    }

    /**
     * 
     * @param {MobManager} mobManager 
     */
    showOldMobs(mobManager) {
        this.socketUser.showOldMobs(mobManager.mobUpdateData);
    }

    /**
     * 
     * @param {number} timeElapsed - timeElapsed since last update 
     */
    update(timeElapsed) {
        this.movableBody.update(timeElapsed, this.intersectables);
    }

    /**
     * OVERRIDE
     */
    toJSON() {
        var instance = this;
        return {
            pos: this.hitBox.pos,
            height: PLAYER_HITBOX_HEIGHT,
            width: PLAYER_HITBOX_WIDTH,
            id: this.id,
            isContact: this.movableBody.isContact
        }
    }

    get intersectables() {
        return this.world.intersectables;
    }

    get pos() {
        return this.hitBox.pos;
    }

    sendUpdate(updateData) {
        this.socketUser.sendUpdate(updateData);
    }

    playerControl(control) {
        switch (control) {
            case PlayerControls.START_WALK_RIGHT:
                this.wantGo = "RIGHT";
                this.startWalk('RIGHT');

                break;
            case PlayerControls.STOP_WALK_RIGHT:
                if (this.wantGo === "RIGHT") {
                    this.wantGo = "NONE";
                }
                this.clearCurrAccImpulse();

                break;
            case PlayerControls.START_WALK_LEFT:
                this.wantGo = "LEFT";
                this.startWalk('LEFT');

                break;
            case PlayerControls.STOP_WALK_LEFT:
                if (this.wantGo === "LEFT") {
                    this.wantGo = "NONE";
                }
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
        if (this.movableBody.isContact) {
            this.clearCurrAccImpulse();
            var dirVec;
            if (dir === 'RIGHT') {
                dirVec = new Vector(1, 0);
            } else if (dir === 'LEFT') {
                dirVec = new Vector(-1, 0);
            } else {
                throw new Error('dir must be either LEFT or RIGHT');
            }
            this.movableBody.generateAccelerateImpulse(dirVec, 100, 300);
        }
    }

    jump() {
        if (this.movableBody.isContact) {
            this.movableBody.wantToJump = true;
        }
    }

    clearCurrAccImpulse() {
        this.movableBody.stopAccelerateImpulse();
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
        switch (event) {
            case 'keydown_right':
                this.spd.x = 250;
                break;
            case 'keydown_left':
                this.spd.x = -250;
                break;
            case 'keyup_right': case 'keyup_left':
                this.spd.x = 0;
                break;
        }
    }

}

module.exports = Protagonist;