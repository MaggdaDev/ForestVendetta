const NetworkCommands = require("../../GameStatic/js/network/networkCommands");
const PlayerControls = require("../../GameStatic/js/playerControls");
const HitBox = require("../physics/hitbox");
const MovableBody = require("../physics/movableBody");
const Vector = require("../../GameStatic/js/maths/vector");
const SocketUser = require("./socketUser");
const PolygonHitBox = require("../physics/polygonHitBox");
const FightingObject = require("../fighting/fightingObject");
const RustySpade = require("../fighting/swords/heavySwords/rustySpade");
const Inventory = require("./inventory");
const ShardRabbitCommunicator = require("../rabbit/shardRabbitCommunicator");
const DropObject = require("./dropObject");

const PLAYER_HITBOX_WIDTH = 25;
const PLAYER_HITBOX_HEIGHT = 100;

class Protagonist {
    static JUMP_FORCE = 50000;
    static DAMAGE = 5;
    static HP = 25;
    static DESIRED_SPEED = 300;
    static ACC_FORCE = 5000;

    /**
     * 
     * @param {Object} playerData - discordAPI, accountLevel, hotbar      see loginwebsite-api-requestHandler createDeployObject
     * @param {*} socket 
     * @param {*} world 
     * @param {*} mainLoop 
     */
    constructor(playerData, socket, world, mainLoop) {
        this.discordData = playerData.discordAPI;
        this.id = this.discordData.id;
        this.userName = this.discordData.username;
        this.startPos = new Vector(500, 500);

        this.world = world;
        this.hitBox = PolygonHitBox.fromRect(this.startPos.x, this.startPos.y, PLAYER_HITBOX_WIDTH, PLAYER_HITBOX_HEIGHT);
        this.socketUser = new SocketUser(socket, this);

        this.mainLoop = mainLoop;

        this.facingLeft = false;

        //physics
        this.movableBody = new MovableBody(this.hitBox, 100, this, this.id);
        this.movableBody.addGravity();
        this.movableBody.disableRotation();

        //send world data
        this.socketUser.sendWorldData(world);

        // moving
        this.wantGo = "NONE";
        this.isWalking = false;
        var instance = this;
        this.movableBody.addOnNewContact(() => {
            if (instance.wantGo !== "NONE") {
                instance.startWalk(instance.wantGo);
            }
        });
        this.movableBody.wayOutPriority = 100;
        this.movableBody.adjustJumpData({ jumpForce: Protagonist.JUMP_FORCE });
        this.movableBody.setProtagonist();

        //Fighting
        this.currentStrike = null;
        this.fightingObject = new FightingObject(() => this.calcDamage(), Protagonist.HP, this.id);
        this.fightingObject.addOnDamageTaken((damageTaken, damagePos, damageNormalAway) => {
            instance.socketUser.sendCommand(NetworkCommands.DAMAGE_ANIMATION, { damage: damageTaken, pos: damagePos });
            instance.movableBody.workForceOverTime(Vector.multiply(damageNormalAway, 40000), 1);
        });
        this.fightingObject.addOnDamageDealt((damageDealt, damagePos, damageNormalAway) => {
            instance.socketUser.sendCommand(NetworkCommands.DAMAGE_ANIMATION, { weaponId: instance.currentHittingWeapon.id, damage: damageDealt, pos: damagePos });
            instance.movableBody.workForceOverTime(Vector.multiply(damageNormalAway, 20000), 1);
        });

        // stats
        this.accountLevel = playerData.accountLevel;


        // inventory
        this.inventory = new Inventory(playerData.hotbar, this);

        // debug
        if(false) {
            console.log("ADDING TEST DROP TO INVENTORY");
            this.inventory.addDrop(new DropObject("RUSTY_SPADE"));
        }

    }

    calcDamage() {
        return this.inventory.selectedItem.getDamage();
    }

    /**
     * 
     * @param {ShardRabbitCommunicator} rabbitCommunicator 
     */
    goodbyeJojo(rabbitCommunicator) {       // on shard death/log out
        console.log("Deconstructing player...");
        // drops
        if(this.inventory.drops.length === 0) {
            console.log("No drops to send.");
        } else {
            console.log("Sending " + this.inventory.drops.length + " drops to scheduler");
            rabbitCommunicator.sendDropsToScheduler(this.id, this.inventory.drops);
        }
    }

    addDrop(item, originPos) {
        this.inventory.addDrop(item);
        this.mainLoop.broadcastToAllPlayers(NetworkCommands.ADD_ITEM_DROP, {id: this.id, weaponRarity: item.config.rarity, originPos: originPos});
    }

    selectItem(index) {
        this.inventory.selectItem(index);
    }

    get equippedWeapon() {
        return this.inventory.selectedItem;
    }

    get currentHittingWeapon() {
        if (this.currentStrike === null) {
            return null;
        }
        return this.currentStrike.weapon;
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
    update(timeElapsed, worldObjects, mobs) {
        this.movableBody.update(timeElapsed, worldObjects.concat(mobs));

        if (this.equippedWeapon) {
            this.equippedWeapon.update(timeElapsed, mobs, this.pos, this.facingLeft);
        }
    }

    strike() {
        if (this.equippedWeapon) {
            this.currentStrike = this.equippedWeapon.strike();

            //this.socketUser.sendCommand(NetworkCommands.COOLDOWN, {weaponId: this.equippedWeapon.id, time: this.equippedWeapon.getCooldown()});
            this.mainLoop.broadcastToAllPlayers(NetworkCommands.STRIKE_ANIMATION, { id: this.id, weaponId: this.equippedWeapon.id, cooldownTime: this.equippedWeapon.getCooldown() })
        }
    }

    /**
     * OVERRIDE
     */
    toJSON() {
        var instance = this;
        return {
            pos: this.hitBox.pos,
            spd: this.movableBody.spd,
            acc: Vector.multiply(this.movableBody.resultingForce, 1.0/this.movableBody.mass),
            height: PLAYER_HITBOX_HEIGHT,
            width: PLAYER_HITBOX_WIDTH,
            id: this.id,
            isContact: this.movableBody.isContact,
            inventory: this.inventory,
            fightingObject: this.fightingObject,
            facingLeft: this.facingLeft,
            isWalking: this.isWalking,
            userName: this.userName
        }
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
                this.facingLeft = false;

                break;
            case PlayerControls.STOP_WALK_RIGHT:
                if (this.wantGo === "RIGHT") {
                    this.wantGo = "NONE";
                }
                this.endWalking();

                break;
            case PlayerControls.START_WALK_LEFT:
                this.wantGo = "LEFT";
                this.startWalk('LEFT');
                this.facingLeft = true;
                break;
            case PlayerControls.STOP_WALK_LEFT:
                if (this.wantGo === "LEFT") {
                    this.wantGo = "NONE";
                }
                this.endWalking();

                break;
            case PlayerControls.STRIKE:
                this.strike();

                break;
            case PlayerControls.START_JUMP:
                this.startJump();
                break;
            case PlayerControls.STOP_JUMP:
                this.stopJump();
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
            this.endWalking();
            var dirVec;
            if (dir === 'RIGHT') {
                dirVec = new Vector(1, 0);
            } else if (dir === 'LEFT') {
                dirVec = new Vector(-1, 0);
            } else {
                throw new Error('dir must be either LEFT or RIGHT');
            }
            this.isWalking = true;
            this.movableBody.generateAccelerateImpulse(dirVec, Protagonist.DESIRED_SPEED, Protagonist.ACC_FORCE);
        }
    }

    startJump() {
        //if (this.movableBody.isContact) {
        this.movableBody.wantToJump = true;
        //}
    }

    stopJump() {
        this.movableBody.wantToJump = false;
    }

    endWalking() {
        this.movableBody.stopAccelerateImpulse();
        this.isWalking = false;
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



}

module.exports = Protagonist;