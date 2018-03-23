var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 3 },
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

    leftKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J)
    rightKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)
    downKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)
    upKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)

    player = this.physics.add.sprite(300, 150, 'loris');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(3000)
    this.physics.add.collider(player, platforms)


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
    let player_move_amt = 600

    movePlayer(leftKey, rightKey, upKey, downKey, player_move_amt)
    // Jump sample from phaser3 tutorial
    // if (cursors.up.isDown && player.body.touching.down)
    // {
    //     player.setVelocityY(-330)
    // }
}

function moveObject( something, x, y){
    something.setVelocityX(x)
    something.setVelocityY(y)
}

function animateObject(something, x, y){
    //convert vector to radian for fun :_)
    direction = Math.atan(y/x)

    if(x>0){
        if(y>0){
            //animate to the northeast
        }else if(y<0){
            //animate to the south east
        }else{
            //animate to the east
            something.anims.play('right', true)
        }
    }else if(x<0){
        if(y>0){
            //animate to the northwest
        }else if(y<0){
            //animate to the southwest
        }else{
            //animate to the west
            something.anims.play('left', true)
        }
    }else if(y>0 && something.body.touching.down){
        //animate to the north
        

    }else if(y<0){
        //animate to the south

    }

}

function movePlayer(leftKey, rightKey, upKey , downKey, distance){
    x = 0
    y = 0

    if (leftKey.isDown){
        x -= distance
    }
    if (rightKey.isDown){
        x += distance
    }
    if (upKey.isDown){
        y -= distance
    }
    if(downKey.isDown){
        y += distance
    }
    moveObject(player, x, y)

    
}