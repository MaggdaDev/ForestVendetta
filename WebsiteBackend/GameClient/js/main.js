var config = {
    type: Phaser.AUTO,
    backgroundColor: '#ffffff',
    parent: 'parentDiv',
    dom: {
        createContainer: true
    },
    input:{
        mouse:{
            target:"parentDiv"// or target:document.getElementById("targetDiv") 
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE
    },
    physics: {
        default: 'arcade'
    },
    scene: [GameScene, OverlayScene]
};

var game = new Phaser.Game(config);
