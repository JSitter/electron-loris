//Trying to break these into separate file isn't working
class Player{
    constructor(){
        this.health = 100
        this.x = 0
        this.y = 0
    }

    setPosition(x,y){
        this.x = x
        this.y = y
    }

    injure(damage){
        this.health -= damage
    }
}

class Mob{
    constructor(name, armor, health, damage, cool_down){
        this.name = name
        this.armor = armor
        this.health = health
        this.damage = damage
        this.cool_down = cool_down
    }
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
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
var camera;
var game = new Phaser.Game(config);
var gameRunning = true



function preload (){
    
    this.load.plugin('AnimatedTiles', '../src/animated-tiles.js');
    this.load.setBaseURL('./assets/');
    this.load.tilemapTiledJSON('map', 'sma-loris.json');
    this.load.image('ground_tiles', 'ground_tiles.png');
    this.load.image('beach_sand_woa3', 'beach_sand_woa3.png');
    this.load.image('pixel', 'pixel.png')
    this.load.image('bar', 'bar.png')


    this.load.spritesheet('loris', 'slow-loris.png', { frameWidth: 32, frameHeight: 48 });
    console.log("preload finished")
}
var shakeTime = 0
function create (){
    //Create maps and Tilesets
    // Install animated tiles plugin
    this.sys.install('AnimatedTiles');
    map = this.make.tilemap({ key: 'map' });
    console.log(map)
    groundTiles = map.addTilesetImage('avalon-ground', 'ground_tiles' )
    waveTiles = map.addTilesetImage('av-waves-3', 'beach_sand_woa3' )
    console.log("go fetch Avalon Ground tiles")
    console.log(groundTiles)
    groundLayer = map.createDynamicLayer('Base', groundTiles, 0, 0);
    waveLayer = map.createDynamicLayer('waves', waveTiles, 0, 0);
    console.log("Charmed")
    // Init animations on map
    this.sys.animatedTiles.init(map);

    //Add Health Bar
    this.add.image(0,0, "bar").setScrollFactor(0)
    this.add.image(0,0, "pixel").setScrollFactor(0)

    // this.add.image(400, 300, 'board');
    // this.add.image(32, 48, 'red')
    this.cameras.main.setSize(800, 800)
    console.log("Main Camera")
    console.log(this.cameras.main)
    // camera = this.cameras.add();
   
    leftKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J)
    rightKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)
    downKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)
    upKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)
    angleKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    healthKey = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H)

    player = this.physics.add.sprite(300, 150, 'loris');
    this.cameras.main.startFollow(player)
    console.log("Player object:")
    console.log(player)
    Loris = new Player()

    player.setBounce(0.2);
    console.log("Game Object:")
    console.log(game)


    player.setCollideWorldBounds(true);
    player.body.setGravityY(0)




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

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    
    stars.children.iterate(function (child) {
    
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
    });
    // logo.setVelocity(100,50);
    // logo.setBounce(1, .98);
    // logo.setCollideWorldBounds(true);

    // emitter.startFollow(logo);

    // countdown 5 sek until change
    countdown = 5000;
}

function update(time, delta){
    if( Loris.health <= 0 && gameRunning ){
        gameOver()
    }


    if (shakeTime > 0)
    {
        shakeTime -= delta;

        this.cameras.main.shake(500);
    }
    let player_move_amt = 60
    if(angleKey.isDown){
        player.setAngularVelocity(400)
    }
    movePlayer(leftKey, rightKey, upKey, downKey, player_move_amt)

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


function dealDamage( obj_ary ){
  
}

function moveObject( something, x, y){
    something.setVelocityX(x)
    something.setVelocityY(y)

}

function gameOver(){
    shakeTime = 2000
    gameRunning = false
    console.log("ded")
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