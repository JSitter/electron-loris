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

var map, waveTiles, groundTiles, waveLayer, groundLayer, countdown, changed;
var game = new Phaser.Game(config);

function preload (){
    
    this.load.plugin('AnimatedTiles', '../src/animated-tiles.js');
    this.load.setBaseURL('./assets/');
    this.load.tilemapTiledJSON('map', 'sma-loris.json');
    this.load.image('ground_tiles', 'ground_tiles.png');
    this.load.image('beach_sand_woa3', 'beach_sand_woa3.png');


    this.load.spritesheet('loris', 'slow-loris.png', { frameWidth: 32, frameHeight: 48 });

}

function create (){
    // Install animated tiles plugin
    this.sys.install('AnimatedTiles');
    map = this.make.tilemap({ key: 'map' });

    waveTiles = map.addTilesetImage('beach_sand_woa3', 'beach_sand_woa3' )
    groundTiles = map.addTilesetImage('ground_tiles', 'ground_tiles' )

    groundLayer = map.createDynamicLayer('Base', groundTiles, 0, 0);
    waveLayer = map.createDynamicLayer('waves', waveTiles, 0, 0);
    // Init animations on map
    this.sys.animatedTiles.init(map);

    // this.add.image(400, 300, 'board');
    // this.add.image(32, 48, 'red')
   
    leftKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J)
    rightKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)
    downKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)
    upKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)
    angleKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)

    player = this.physics.add.sprite(300, 150, 'loris');
    console.log(player)
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(3000)




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

    // countdown 5 sek until change
    countdown = 5000;
}

function update(time, delta){
    let player_move_amt = 600
    if(angleKey.isDown){
        player.setAngularVelocity(400)
    }
    movePlayer(leftKey, rightKey, upKey, downKey, player_move_amt)
    // Jump sample from phaser3 tutorial
    // if (cursors.up.isDown && player.body.touching.down)
    // {
    //     player.setVelocityY(-330)
    // }
    countdown-=delta;
    // countdown is done, but the change hasn't been done
    if(countdown <0 && !changed){
        // Native API-method to fill area with tiles
        // layer3.fill(1525, 1, 1, 3, 3);
        // Need to tell the plugin about the new tiles.
        // ATM it will go through all tilemaps and layers,
        // but I'll add support for limiting the task to
        // maps, layers and areas within that. 
        console.log(this.sys)
        this.sys.animatedTiles.updateAnimatedTiles();
        // Ok. don't hammer tiles on each update-loop. the change is done.
        changed = true;
}
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