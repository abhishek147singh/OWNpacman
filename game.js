var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    backgroundColor: '#1a1a2d',
    physics: {
        default: 'arcade',
        arcade: {
        }
    },
   
    scene:[ Main , GameOver]
};

var game = new Phaser.Game(config);
