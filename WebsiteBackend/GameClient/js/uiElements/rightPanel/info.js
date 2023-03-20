class Info extends Phaser.GameObjects.Container {
    static INFO_PADDING = 20;
    static INFO_FONTSIZE = "20px";
    static LABEL_FONTSIZE = "30px";
    constructor(overlayScene, labelText) {
        super(overlayScene,0,0);
        this.label = overlayScene.add.text(0, -40, labelText, { color: "black", fontSize: Info.LABEL_FONTSIZE });
        this.info = overlayScene.add.text(0, 0, "", { color: "black", fontSize:Info.INFO_FONTSIZE });
        this.info.setPadding(Info.INFO_PADDING, 0,0,0);
        Phaser.Display.Align.To.BottomLeft(this.info, this.label);
        this.add(this.info);
        this.add(this.label);
    }

    setInfo(info) {
        this.info.setText(info);
    }

    setError() {
        this.info.setColor("red");
        this.info.setStroke("black", 1);
    }

    setWarning() {
        this.info.setColor("yellow");
        this.info.setStroke("black", 1);
    }

}
