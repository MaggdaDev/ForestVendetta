class PhysicsControlInfo {

    /**
     * 
     * @param {Scene} scene 
     */
    constructor(scene) {
        this.scene = scene;
        this.phaserText = scene.add.text(0,0,"ALLAHU AKBAR",  { font: '11px Courier', fill: '#000000' });
        this.phaserText.setVisible(true);
    }

    updateText(data) {
        data = JSON.parse(data);
        var totKin = 0;
        var totRot = 0;
        var momX = 0;
        var momY = 0;
        var rotMom = 0;
        var heightEnergy = 0;
        data.forEach((element)=>{
            totKin += element.kineticEnergy;
            totRot += element.rotationEnergy;
            momX += element.momentum.x;
            momY += element.momentum.y;
            rotMom += element.rotMomentum;
            heightEnergy += element.heightEnergy;
        });
        
        this.phaserText.text = "Total kin Energy: " + Math.round(totKin) + " Total rot energy: " + Math.round(totRot) + " Total height energy: " + Math.round(heightEnergy) + " kin+rot+height: " + (Math.round(totRot) + Math.round(totKin) + Math.round(heightEnergy)) +
        "\nTotal momentum: (" + Math.round(momX) + "|" + Math.round(momY) + ")" + 
        "\nTotal rotMomentum: " + rotMom;
    }
}