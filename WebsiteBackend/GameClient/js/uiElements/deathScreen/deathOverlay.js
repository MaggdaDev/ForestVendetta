class DeathOverlay extends Phaser.GameObjects.Container {
    constructor(overlayScene) {
        super(overlayScene, 0, 0);
        this.mainText = overlayScene.add.text(0, -100, "Ha lol u dead; nab jajaja", { color: "black", fontSize: "40px" });
        this.mainText.setOrigin(0.5, 0.5);
        this.add(this.mainText);

        this.respawnTimer = overlayScene.add.text(0, 0, "", { color: "black", fontSize: "30px" });
        this.respawnTimer.setOrigin(0.5,0.5);
        Phaser.Display.Align.To.BottomCenter(this.respawnTimer, this.mainText);
        this.add(this.respawnTimer);
        this.timer = 0;
        this.respawnDuration = null;
    }


    startRespawn(respawnDurationMillis) {
        this.setVisible(true);
        this.respawnDuration = respawnDurationMillis;
        this.timer = 0;
    }

    updateRespawn(timeElaspedMillis) {
        this.timer += timeElaspedMillis;
        if (this.timer > this.respawnDuration) {
            this.setVisible(false);
        } else {
            this.setTimerTimerInMillis(this.respawnDuration - this.timer);
        }
    }

    setTimerTimerInMillis(time) {
        var timeNice = (Math.round(time / 100) / 10).toString();
        if(timeNice.length == 1) {
            timeNice += ".0";
        }
        this.respawnTimer.setText("Respawn in " + timeNice + "s ...");
    }
}