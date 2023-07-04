class StatsPanel extends Phaser.GameObjects.Container {
    static STATS_FONTSIZE = "15px";
    constructor(overlayScene) {
        super(overlayScene, 0, 0);
        this.overlayScene = overlayScene;

        this.statInfos = {
            maxHp: this.createLabelledInfo("MAX HP"),
            defense: this.createLabelledInfo("DEF"),
            damage: this.createLabelledInfo("DMG"),
        }
        this.childrenArray = [];

        for (var statInfo of Object.values(this.statInfos)) {
            this.add(statInfo[0]);
            this.add(statInfo[1]);
            this.childrenArray.push(statInfo[0]);
            this.childrenArray.push(statInfo[1]);
        }

        Phaser.Actions.GridAlign(this.childrenArray,  {
            width: 2,
            height: 3,
            cellWidth: 70,
            cellHeight: 25
        });

    }

    createLabelledInfo(name) {
        
        const label = this.overlayScene.add.text(0, 0, name, { color: "black", fontSize: StatsPanel.STATS_FONTSIZE });
        
        const valueLabel = this.overlayScene.add.text(0, 0, "", { color: "black", fontSize: StatsPanel.STATS_FONTSIZE });
        return [label, valueLabel];
    }

    update(statsObject) {
        this.statInfos.maxHp[1].setText("" + statsObject.maxHpStat._value);
        this.statInfos.defense[1].setText("" + statsObject.defenseStat._value);
        this.statInfos.damage[1].setText("" + statsObject.damageStat._value);
    }

}