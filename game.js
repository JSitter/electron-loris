var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload (){
    
    this.load.setBaseURL('./');

    this.load.image('board', 'board.jpg');
    this.load.spritesheet('loris', 'slow-loris.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('red', 'slow-loris.png');
}

function create (){
    this.add.image(400, 300, 'board');
    this.add.image(32, 48, 'red')
   
    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'red').setScale(2).refreshBody();

    platforms.create(600, 400, 'red');
    platforms.create(50, 250, 'red');
    platforms.create(750, 220, 'red');

    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.J)
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.L)
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.K)
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.I)

    player = this.physics.add.sprite(50, 8, 'loris');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('loris', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'loris', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('loris', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    // logo.setVelocity(100,50);
    // logo.setBounce(1, .98);
    // logo.setCollideWorldBounds(true);

    // emitter.startFollow(logo);
}

function update(){

    if (leftKey.isDown)
{
    player.setVelocityX(-160);

    player.anims.play('left', true);
}
else if (cursors.right.isDown)
{
    player.setVelocityX(160);

    player.anims.play('right', true);
}
else
{
    player.setVelocityX(0)
    player.anims.play('turn')
}

if (cursors.up.isDown && player.body.touching.down)
{
    player.setVelocityY(-330)
}
}

function movePlayer(player, x, y){
    player.setVelocityX(x)
    player.setVelocityY(y)
    if(x>0){
        if(y>0){
            //animate to the northeast
        }else if(y<0){
            //animate to the south east
        }else{
            //animate to the east
        }
    }else if(x<0){
        if(y>0){
            //animate to the northwest
        }else if(y<0){
            //animate to the southwest
        }else{
            //animate to the west
        }
    }else if(y>0){
        //animate to the north
    }else if(y<0){
        //animate to the south
    }

    player.anims.play('left', true)
}