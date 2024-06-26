const NetworkCommands = require("../../GameStatic/js/network/networkCommands");
const PlayerControls = require("../../GameStatic/js/playerControls");
const HitBox = require("../physics/hitbox");
const MovableBody = require("../physics/movableBody");
const Vector = require("../../GameStatic/js/maths/vector");
const SocketUser = require("./socketUser");
const PolygonHitBox = require("../physics/polygonHitBox");
const FightingObject = require("../fighting/fightingObject");
const Inventory = require("./inventory");
const ShardRabbitCommunicator = require("../rabbit/shardRabbitCommunicator");
const DropObject = require("./dropObject");
const Timer = require("../../GameStatic/js/util/timer");
const GradeHandler = require("./gradeHandler");
const MainLoop = require("../mainLoop");
const FacadeForFightingObject = require("../fighting/facadeForFightingObject");
const ArmorHolder = require("../items/armor/armorHolder");
const PlayerStats = require("./playerStats");



class Protagonist {
    static JUMP_FORCE = 50000;
    static DESIRED_SPEED = 300;
    static ACC_FORCE = 5000;

    static RESPAWN_TIME = 1000; // millis
    static START_POS = new Vector(500, 500);

    static PLAYER_HITBOX_WIDTH = 25;
    static PLAYER_HITBOX_HEIGHT = 100;

    /**
     * 
     * @param {Object} playerData - discordAPI, mongoData, hotbar      see loginwebsite-api-requestHandler createDeployObject
     * @param {*} socket 
     * @param {*} world 
     * @param {Object} match - current match_config from boss
     * @param {MainLoop} mainLoop 
     */
    constructor(playerData, socket, world, match, mainLoop) {
        this.discordData = playerData.discordAPI;
        this.id = this.discordData.id;
        this.userName = this.discordData.username;
        this.emoteObjects = playerData.mongoData.emotes; // type: {id: 123, name: "abc"}


        this.isIngame = true;
        this.isDisabled = false;
        this.stopwatchIngameSeconds = 0;
        mainLoop.getMobManager().addOnFightReset(() => this.stopwatchIngameSeconds = 0);
        this.alreadyExited = false;
        this.isAlive = true;;

        this.startPos = Protagonist.START_POS.clone();
        this.world = world;
        this.hitBox = PolygonHitBox.fromRect(this.startPos.x, this.startPos.y, Protagonist.PLAYER_HITBOX_WIDTH, Protagonist.PLAYER_HITBOX_HEIGHT);
        this.socketUser = new SocketUser(socket, this);

        this.mainLoop = mainLoop;

        this.facingLeft = false;

        //physics
        this.movableBody = new MovableBody(this.hitBox, 100, this, this.id);
        this.movableBody.addGravity();
        this.movableBody.disableRotation();

        //send world data
        this.socketUser.sendWorldData(world);

        //send match data
        this.socketUser.sendMatchData(match);

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








        // stats
        this.stats = new PlayerStats();
        this.accountLevel = playerData.mongoData.accountLevel;

        //Fighting - after stats!
        this.currentStrike = null;
        const fightingObjectFacade = new FacadeForFightingObject();
        fightingObjectFacade.getOwnerPosition = () => {
            return this.pos;
        };
        fightingObjectFacade.getOwnerStats = () => {
            return this.getStats();
        }
        this.fightingObject = new FightingObject(fightingObjectFacade, this.id);
        this.fightingObject.addOnDamageTaken((damageTaken, damagePos, damageNormalAway) => {
            instance.socketUser.sendCommand(NetworkCommands.DAMAGE_ANIMATION, { damage: damageTaken, pos: damagePos });
            instance.movableBody.workForceOverTime(Vector.multiply(damageNormalAway, 40000), 1);
        });
        this.fightingObject.addOnDamageDealt((damageDealt, damagePos, damageNormalAway) => {
            instance.socketUser.sendCommand(NetworkCommands.DAMAGE_ANIMATION, { weaponId: instance.currentHittingWeapon.id, damage: damageDealt, pos: damagePos });
            instance.movableBody.workForceOverTime(Vector.multiply(damageNormalAway, 20000), 1);
        });

        // inventory - after fighting
        this.inventory = new Inventory(playerData.hotbar, this);
        this.armorHolder = new ArmorHolder(playerData.armorBar);

        // inventory stats - after stats and inventory
        this.armorHolder.insertPieceStatsIntoPlayerStats(this.stats);
        if (this.inventory.isWeaponSelected()) {
            this.stats.setWeaponStats(this.inventory.selectedItem.getStats());
        }


        // grade after fighting!

        this.gradeHandler = new GradeHandler(this.fightingObject,
            mainLoop.getMobManager(),
            () => this.deaths,
            () => this.stopwatchIngameSeconds,
            () => mainLoop.getStopwatchFightDuration());
        this.deaths = 0;
        mainLoop.getMobManager().addOnFightReset(() => this.deaths = 0);
        this.gradeData = {
            deaths: this.deaths,
            grade: this.gradeHandler.grade,
            fightDuration: mainLoop.getStopwatchFightDuration()
        }

        // respawning
        this.respawnTimer = new Timer(Protagonist.RESPAWN_TIME, () => this.respawn());
        mainLoop.addTimer(this.respawnTimer);

        // debug
        if (false) {
            console.log("ADDING TEST DROP TO INVENTORY");
            this.inventory.addDrop(new DropObject("RUSTY_SPADE"));
        }

    }


    /**
     * 
     * @param {number} timeElapsed - timeElapsed since last update 
     */
    update(timeElapsed, worldObjects, mobs) {
        this.stopwatchIngameSeconds += timeElapsed;
        if (this.isInteractable) {
            this.movableBody.update(timeElapsed, worldObjects.concat(mobs));

            if (this.equippedWeapon) {
                this.equippedWeapon.update(timeElapsed, mobs, this.pos, this.facingLeft);
            }

            this.updateAlive(timeElapsed);
        }
    }

    postUpdate() {
        this.movableBody.postUpdate();
    }

    // alive and dead
    updateAlive(timeElasped) {
        if (this.isAlive && (!this.fightingObject.isAlive())) {
            this.die();
        }
        if (this.pos.y > 5000) {
            this.die();
            this.pos.y = Protagonist.START_POS.y;
        }
    }

    die() {
        this.isAlive = false;
        this.deaths += 1;
        this.socketUser.sendDeathToClient(Protagonist.RESPAWN_TIME);
        this.initRespawn();
        console.log("Player " + this.id + " died.");
    }

    initRespawn() {
        this.respawnTimer.start();
    }

    respawn() {
        console.log("Player " + this.id + " respawned.");
        this.fightingObject.resetHp();
        this.movableBody.reset();
        this.pos = Protagonist.START_POS.clone();
        this.isAlive = true;
    }

    // end alive and dead

    getBaseDamage() {
        return 0;
    }


    showEmote(emoteID) {
        var hasEmote = false;
        for (var currEmote of this.emoteObjects) {   // check if player has emote selected
            if (currEmote.id === emoteID) {
                console.log("Player " + this.id + " has emote " + emoteID);
                hasEmote = true;
                break;
            }
        }
        if (!hasEmote) {
            console.error("Player " + this.id + " does not have emote " + emoteID);
            return;
        }
        this.mainLoop.showEmote(this.id, emoteID);
    }

    /**
     * 
     * @param {ShardRabbitCommunicator} rabbitCommunicator 
     */
    goodbyeJojo(rabbitCommunicator, onFinished) {       // on shard death/log out
        if (this.alreadyExited) {
            console.log("Already exited");
            return;
        }
        this.alreadyExited = true;
        console.log("Deconstructing player...");
        this.setIsIngame(false);
        // drops
        if (this.inventory.drops.length === 0) {
            console.log("No drops to send.");
            if (onFinished !== undefined) {
                onFinished();
            }
        } else {
            console.log("Sending " + this.inventory.drops.length + " drops to scheduler");
            rabbitCommunicator.sendDropsToScheduler(this.id, this.inventory.drops, onFinished, this.mainLoop.rabbitCommunicator.gameQueueName);
        }
    }

    addDrop(item, originPos) {
        this.inventory.addDrop(item);
        this.mainLoop.broadcastToAllPlayers(NetworkCommands.ADD_ITEM_DROP, { id: this.id, weaponRarity: item.config.rarity, originPos: originPos });
    }

    /**
     * @description Disables player: invisible (except health bar and name), no hitbox, not controllable. When changing disable: reset speed
     * @param {boolean} disabled 
     */
    setDisabled(disabled) {
        if(disabled !== this.isDisabled) {
            this.movableBody.spd.setTo(new Vector(0,0));
        }
        this.isDisabled = disabled;
    
    }

    selectItem(index) {
        this.inventory.selectItem(index);
        if (this.inventory.isWeaponSelected()) {
            this.stats.setWeaponStats(this.inventory.selectedItem.getStats());
        } else {
            this.stats.setWeaponStats(null);
        }
        this.stats.getTotalStats();

    }

    handleLeaveGameRequest() {
        console.log("Starting handle leave game process...");
        this.goodbyeJojo(this.mainLoop.rabbitCommunicator, () => {
            console.log("Saving finished!");
            this.socketUser.sendRedirectToHome();
        });
        this.socketUser.sendShowSavingProgressScreen();
    }

    getDropProbabilityModifier() {
        return this.gradeHandler.dropProbabilityModifier;
    }

    getStats() {
        return this.stats.getTotalStats();
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


    get isInteractable() {
        return this.isAlive && this.isIngame && (!this.alreadyExited) && (!this.isDisabled);
    }

    setIsIngame(b) {
        this.isIngame = b;
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
            acc: Vector.multiply(this.movableBody.resultingForce, 1.0 / this.movableBody.mass),
            height: Protagonist.PLAYER_HITBOX_HEIGHT,
            width: Protagonist.PLAYER_HITBOX_WIDTH,
            id: this.id,
            isContact: this.movableBody.isContact,
            inventory: this.inventory,
            armorBar: this.armorHolder,
            fightingObject: this.fightingObject,
            facingLeft: this.facingLeft,
            isWalking: this.isWalking,
            userName: this.userName,
            isAlive: this.isAlive,
            isDisabled: this.isDisabled,
            gradeData: this.updateGradeData(),
            stats: this.stats.getLastCalculatedTotalStats(),
            emoteObjects: this.emoteObjects
        }
    }

    updateGradeData() {
        this.gradeData.grade = this.gradeHandler.grade;
        this.gradeData.deaths = this.deaths;
        this.gradeData.fightDuration = Math.round(this.mainLoop.getStopwatchFightDuration());
        return this.gradeData;
    }

    get pos() {
        return this.hitBox.pos;
    }

    set pos(pos) {
        this.hitBox.pos = pos;
    }

    sendUpdate(updateData) {
        if (this.isIngame) {
            this.socketUser.sendUpdate(updateData);
        }
    }

    playerControl(control) {
        if (!this.isDisabled) {
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
        } else {
            console.log("Ignored player control " + control + " since player is disabled.");
        }
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