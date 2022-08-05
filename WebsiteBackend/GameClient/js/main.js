var config = {
    type: Phaser.AUTO,
    width: 2000,
    height: 1000,
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade'
    },
    scene: new GameScene()
};

var game = new Phaser.Game(config);
