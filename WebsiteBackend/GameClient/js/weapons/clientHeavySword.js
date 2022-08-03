class ClientHeavySword extends ClientWeapon {
    constructor(scene, imageName, data) {
        super(scene, imageName, data);
    }


    strikingDisplayData(frame) {
        console.log(frame);
        switch (frame) {
            case 2:
                return { pos: { x: -15, y: -60 }, rot: -115 };
            case 3:
                return { pos: { x: 70, y: -3 }, rot: 50 };
            case 4: case 0:
                return { pos: { x: 55, y: -35 }, rot: 0 };
            default:
                console.error("Unknown animation frame!");
                break;
        }
    }

}