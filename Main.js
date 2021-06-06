let layer;
var controls;
let player;
let offset = 16; 
let score = 0;
let coliPill;
let ghost;
let sence;
let ghost1;
let ghost2;
let ghost3;
let ghost4;
let ghostList = [];
let dire = 'left';
let scoreText;
let pills;
let cursors;
let time = 0;
let state = 'gameOver';
class Main extends Phaser.Scene {
    constructor() {
        super({ key: "Example6" });
    }
    preload() {
        this.load.image('tiles', 'assets/backg.png');
        this.load.spritesheet('car', 'assets/pacman.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('dot', 'assets/pill.png');
        this.load.spritesheet('ghost', 'assets/ghost.png', { frameWidth: 64, frameHeight: 64 });
        this.load.tilemapTiledJSON('map', 'assets/forwall3.json');
    }

    create() {
        sence = this;
        var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        const tileset = map.addTilesetImage('backg', 'tiles');
        layer = map.createLayer('Tile Layer 1', tileset, 0, 0);
        let pillLayer = map.getObjectLayer('pillLayer')['objects'];

        ghost1 = new GhostClass('ghost', { x: 336, y: 304 }, 'left');
        ghost2 = new GhostClass('ghost', { x: 430, y: 304 }, 'left');
        ghost3 = new GhostClass('ghost', { x: 368, y: 304 }, 'left');
        ghost4 = new GhostClass('ghost', { x: 396, y: 304 }, 'left');
        ghostList.push(ghost1.sprite, ghost2.sprite, ghost3.sprite, ghost4.sprite);
        player = this.physics.add.sprite(32 + 16, 32 + 16, 'car').setScale(0.5);

        scoreText = this.add
            .text(265, 574, "Score: " + score)
            .setFontFamily("Arial")
            .setFontSize(18)
            .setColor("#ffffff");


        //  Left
        this.input.keyboard.on('keydown-A', function (event) {

            var tile = layer.getTileAtWorldXY(player.x - 32, player.y, true);
            if (tile.index === 88) {
                //  Blocked, we can't move
            }
            else {
                dire = null;
                player.x -= 32;
                player.angle = 180;
                player.flipY = 1;
            }

        });

        //  Right
        this.input.keyboard.on('keydown-D', function (event) {

            var tile = layer.getTileAtWorldXY(player.x + 32, player.y, true);
            if (tile.index === 88) {
                //  Blocked, we can't move
            }
            else {
                dire = null;
                player.x += 32;
                player.angle = 0;
                player.flipY = 0;
            }

        });



        //  Up
        this.input.keyboard.on('keydown-W', function (event) {

            var tile = layer.getTileAtWorldXY(player.x, player.y - 32, true);
            if (tile.index === 88) {
                //  Blocked, we can't move
            }
            else {
                dire = null;
                player.y -= 32;
                player.angle = -90;
            }

        });

        //  Down
        this.input.keyboard.on('keydown-S', function (event) {
            var tile = layer.getTileAtWorldXY(player.x, player.y + 32, true);
            if (tile.index === 88) {
                //  Blocked, we can't move
            }
            else {
                dire = null;
                player.y += 32;
                player.angle = 90;
            }

        });

        this.dots = this.physics.add.group();

        pills = this.physics.add.group();

        pillLayer.forEach(object => {
            let obj = pills.create(object.x, object.y, 'dot');
            obj.setScale(0.2, 0.2);
            obj.setOrigin(0);
            obj.body.width = object.width;
            obj.body.height = object.height;

        });

        this.anims.create({
            key: 'pacman',
            frames: sence.anims.generateFrameNumbers('car', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        player.anims.play('pacman');
        cursors = this.input.keyboard.createCursorKeys();
    }

    eatPill() {
        pills.children.entries.forEach(e => {
            if (e.x - player.x <= 18 && e.x - player.x >= -18 && e.y - player.y <= 18 && e.y - player.y >= -18) {
                e.destroy(e.x, e.y);
                score += 10;
                scoreText.setText('Score : ' + score);
            }

        });
        if (pills.countActive(true) === 0) {
            console.log('game Win !');
            state = 'Game Win' ;
        }
    }

    hitBomb() {
        ghostList.forEach((e) => {
            if (e.x - player.x <= 18 && e.x - player.x >= -18 && e.y - player.y <= 18 && e.y - player.y >= -18) {
                player.destroy(e.x, e.y);
                this.scene.start('Example2');
            }
        });
    }
    update(time, delta) {
        this.eatPill();
        this.hitBomb();
        this.setDirections();
        this.setSafe();
        this.TimeFun();
    }

    setDirections() {
        if (cursors.left.isDown) {
            dire = 'left';
        }
        else if (cursors.right.isDown) {
            dire = 'right';
        }
        else if (cursors.down.isDown) {
            dire = 'buttom';
        }
        else if (cursors.up.isDown) {
            dire = 'up';
        }
    }

    setSafe() {
        switch (dire) {
            case 'left':
                if (this.checkDirection('left').index != 88) {
                    this.PlayerMove('left');
                    player.angle = 180;
                    player.flipY = 1;
                }
                break;
            case 'right':
                if (this.checkDirection('right').index != 88) {
                    this.PlayerMove('right');
                    player.angle = 0;
                    player.flipY = 0;
                }
                break;
            case 'up':
                if (this.checkDirection('up').index != 88) {
                    this.PlayerMove('up');
                    player.angle = -90;
                }
                break;
            case 'buttom':
                if (this.checkDirection('buttom').index != 88) {
                    this.PlayerMove('buttom');
                    player.angle = 90;
                }
                break;
            default:
                break;
        }

    }

    checkDirection(direction) {
        let tile;
        switch (direction) {
            case 'left':
                tile = layer.getTileAtWorldXY(player.x - 15, player.y, true);
                break;
            case 'right':
                tile = layer.getTileAtWorldXY(player.x + 15, player.y, true);
                break;
            case 'up':
                tile = layer.getTileAtWorldXY(player.x, player.y - 15, true);
                break;
            case 'buttom':
                tile = layer.getTileAtWorldXY(player.x, player.y + 20, true);
                break;
            default:
                break;
        }
        return tile;
    }

    PlayerMove(direction) {
        switch (direction) {
            case 'left':
                player.x -= 5;
                break;
            case 'right':
                player.x += 5;

                break;
            case 'up':
                player.y -= 5;

                break;
            case 'buttom':
                player.y += 5;
                break;
            default:
                break;
        }
    }
    
TimeFun(){
    time++;
    if(time%4 == 0 ){
        ghost1.isSafe();
        ghost2.isSafe();
        ghost3.isSafe();
        ghost4.isSafe();
    }
    time = time > 10 ? 0:time;  
}
}

class GhostClass {
    constructor(sprite, position, direction) {
        this.pos = position;
        this.anims = sprite;
        this.sprite = sence.add.sprite(this.pos.x, this.pos.y, 'ghost').setScale(0.4)
            .setOrigin(0.5);
        this.speed = 100;
        this.directions = ['left', 'right', 'up', 'buttom'];
        this.f = 0;
        this.selected = 'left';
        sence.anims.create({
            key: 'ghost',
            frames: sence.anims.generateFrameNumbers('ghost', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.sprite.anims.play(this.anims, true);
    }
    isSafe() {
        if (this.checkDirection(this.selected).index == 88) {
            this.GhostMovement();
        } else {
            this.GhostMove(this.selected);
        }

    }
    getRandonNum() {
        return Math.floor(Math.random() * 4);
    }

    checkNum(f) {
        return (this.checkDirection(this.directions[f]).index) == 88;
    }

    GhostMovement() {
        this.f = this.getRandonNum();
        while (this.checkNum(this.f)) {
            this.f = this.getRandonNum();
        }
        this.selected = this.directions[this.f];
        this.GhostMove(this.selected);
    }

    GhostMove(direction) {
        switch (direction) {
            case 'left':
                this.pos.x -= 32;
                break;
            case 'right':
                this.pos.x += 32;
                break;
            case 'up':
                this.pos.y -= 32;
                break;
            case 'buttom':
                this.pos.y += 32;
                break;
            default:
                break;
        }
        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y;
    }

    checkDirection(direction) {
        let tile;
        switch (direction) {
            case 'left':
                tile = layer.getTileAtWorldXY(this.pos.x - 32, this.pos.y, true);
                break;
            case 'right':
                tile = layer.getTileAtWorldXY(this.pos.x + 32, this.pos.y, true);
                break;
            case 'up':
                tile = layer.getTileAtWorldXY(this.pos.x, this.pos.y - 32, true);
                break;
            case 'buttom':
                tile = layer.getTileAtWorldXY(this.pos.x, this.pos.y + 32, true);
                break;
            default:
                break;
        }
        return tile;
    }

}
