class LeaveButton extends GameButton{
    /**
     * 
     * @param {Scene} scene 
     * @param {NetworkManager} networkManager 
     */
    constructor(scene, networkManager) {
        super(scene, 20,30, "Leave match");
        super.setOnAction((e) => this.leave());
        this.networkManager = networkManager;
    }

    leave() {
        this.networkManager.sendLeaveGameRequest();
        console.log("Requested leave command from network manager.");
    }
}