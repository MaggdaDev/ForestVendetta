class RightPanel extends Phaser.GameObjects.Container {
    static SPACING = 10;
    constructor(overlayScene) {
        super(overlayScene,0,0);
        this.currY = 0;

        // grade
        this.gradeInfo = this.pushInfo(overlayScene, "Rating:");

        // deaths
        this.deathsInfo = this.pushInfo(overlayScene, "Deaths:");

        // time
        this.stopwatchInfo = this.pushInfo(overlayScene, "Fighting for:");

        // box around
        const bounds = this.getBounds();
        this.box = overlayScene.add.rectangle(bounds.x, bounds.y, bounds.width, bounds.height);
        this.box.setStrokeStyle(1, "lightgrey");
        this.box.setOrigin(0,0);
        this.add(this.box);
    }

    pushInfo(scene, infoLabelText) {
        const element = new Info(scene, infoLabelText);
        this.pushElement(element);
        return element;
    }

    pushElement(element) {
        element.setY(this.currY);
        this.add(element);
        this.currY += element.getBounds().height;
        this.currY += RightPanel.SPACING;
    }

    updateGradeData(gradeData) {
        this.setGrade(gradeData.grade);
        this.setStopwatch(gradeData.fightDuration);
        this.setDeaths(gradeData.deaths);
    }

    setGrade(grade) {
        this.gradeInfo.setInfo(grade);
    }

    setStopwatch(timeSeconds) {
        this.stopwatchInfo.setInfo(this.secondsToSecMin(timeSeconds));
    }

    setDeaths(deaths) {
        this.deathsInfo.setInfo(deaths.toString());
    }

    secondsToSecMin(secondsFull) {
        const mins = Math.floor(secondsFull / 60.0);
        const seconds = Math.round(secondsFull - mins*60.0);
        var secondsString = seconds.toString();
        if(secondsString.length === 1) {
            secondsString = "0" + secondsString;
        }
        var ret = "";
        if(mins !== 0) {
            ret += mins + "m";
        }
        return ret + secondsString + "s";
    }
}