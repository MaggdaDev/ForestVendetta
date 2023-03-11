class GameButton {
    constructor(scene, x, y, text) {
        this.sprite = scene.add.dom(x,y).createFromCache('gameButton');
        this.sprite.setOrigin(0,0);
        this.scene = scene;
        this.onAction = (e) => {};
        this.sprite.addListener("click");
        this.sprite.on("click", (e) => {
            console.log("Button click!");
            this.onAction(e);
        })
    }

    setOnAction(handler) {
        this.onAction = handler;
    }

}