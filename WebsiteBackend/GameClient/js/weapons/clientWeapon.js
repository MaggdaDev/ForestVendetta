class ClientWeapon {
    constructor(scene, imageName, data) {
        this.mainScene = scene;
        this.sprite = this.mainScene.add.image(0, 0, imageName, 'Phaser 3 pixelArt: true');
        this.debugPolygon = this.mainScene.add.polygon(0, 0, data.hitBox.points, 0xFF33ff);
        this.debugPolygon.displayOriginX = 0.5;
        this.debugPolygon.displayOriginY = 0.5;
        this.sprite.displayHeight = 64;
        this.sprite.displayWidth = 64;
        this.sprite.setVisible(false);

        this.isStriking = false;

        this.debugPolygon.setVisible(false);

        // cooldown
        this.onCooldown = false;
        this.cooldownStart = 0;
        this.cooldownTime = 0;
    }

    cooldown(time) {
        console.log("Cooldown started!");
        this.onCooldown = true;
        this.cooldownStart = this.now;
        this.cooldownTime = time;
    }

    checkCooldown() {
        if(this.onCooldown) {
            var timeElapsed = this.now - this.cooldownStart;
            if(timeElapsed > this.cooldownTime) {
                this.onCooldown = false;
                console.log("Cooldown terminated!");
                return true;
            } else {
                console.log("ON COOLDOWN!");
                return false;
            }
        }
        return true;
    }

    get now() {
        return Date.now() / 1000.0;
    }

    recreateDebugPolygon(x,y,points) {
        if (this.debugPolygon.visible) {
            this.debugPolygon.destroy();
            this.debugPolygon = this.mainScene.add.polygon(x, y, points, 0xFF33ff);
            this.debugPolygon.displayOriginX = 0.5;
            this.debugPolygon.displayOriginY = 0.5;
            this.debugPolygon.setVisible(true);
        }
    }

    static fromData(scene, data) {
        switch (data.typeData.type) {
            case "RUSTY_SPADE":
                return new ClientRustySpade(scene, data);
            default:
                console.error("UNSUPPORTED WEAPON TYPE: " + data.typeData.type);
                break;
        }
    }

    startStrike() {
        this.isStriking = true;
    }

    update(frame) {
        var data = this.displayData(frame);
        this.sprite.x = data.pos.x;
        this.sprite.y = data.pos.y;
        this.sprite.angle = data.rot;
    }


    displayData(frame) {
        if (this.isStriking) {
            return this.strikingDisplayData(frame);
        } else {
            return this.strikingDisplayData(0);
        }
    }

    strikingDisplayData(frame) {
        console.error("PLEASE OVERRIDE STRIKING DISPLAY DATA!");
    }


    set visible(v) {
        this.sprite.setVisible(v);
    }

    set playerPos(pos) {
        this.weaponPos = this.playerToWeaponPos(pos);
    }

    playerToWeaponPos(pos) {
        return pos;
    }

    set weaponPos(pos) {
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
    }
}