class RightPanel extends Phaser.GameObjects.Container {
    constructor(overlayScene) {
        super(overlayScene,0,0);
        this.gradeLabel = overlayScene.add.text(0, -40, "Rating:", { color: "black", fontSize: "40px" });
        this.gradeInfo = overlayScene.add.text(0, 0, "", { color: "black", fontSize: "30px" });
        this.gradeLabel.setOrigin(1, 0.5);
        this.gradeInfo.setOrigin(1,0.5);
        this.add(this.gradeInfo);
        this.add(this.gradeLabel);
    }

    setGrade(grade) {
        this.gradeInfo.setText(grade);
    }
}