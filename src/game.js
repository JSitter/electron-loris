//Trying to break these into separate file isn't working
class Player{
    constructor(sprite){
        this.starting_health = 100
        this.cooldown = 2000
        this.health = this.starting_health
        this.x = 0
        this.y = 0
    }

    setPosition(x,y){
        this.x = x
        this.y = y
    }

    injure(damage){
        updateHUD(damage * -1)
        this.health -= damage
    }

    updateHUD(amount){
        let bar_pixel_width = 80

    }


}

class Mob{
    constructor(sprite, name, health, damage, cool_down, id){
        this.id = id
        this.sprite = sprite
        this.name = name
        this.health = health
        this.damage = damage
        this.cool_down = cool_down
        this.direction = "left"
        this.x = 0
        this.y = 0
        this.target = false


    }
    injure(damage){
        this.health -= damage
        if( this.health <=0){
            this._death_sequence()
        }
        return this.health
    }
    _death_sequence(){
        sprite.anims.play(this.name+'-death-'+this.direction)
    }
}

class dungeonMaster{
    constructor(name, num_mobs, spawn_period, sprite_lever){
        //Spawn Period is in time minutes
        this.name = name
        this.num_mobs = num_mobs
        this.spawn_period = spawn_period
        this.creation_time = false
        this.mob_box = []
        this.sprite_lever = sprite_lever
        while( this.mob_box.length  < num_mobs){
            this.spawn_mob("wolf", 10)
        }
    }

    tick(time, delta){
        if(this.mob_box.length<this.num_mobs){
            this.mob_roll(time)
        }
       
    }

    mob_roll(time, delta){
        roll = Math.random(time)
        mob_prob = (delta/ this.spawn_period * 60000)
        if(roll <= mob_prob){
            //spawn mob
            this.spawn_mob('wolf', 10)
        }
    }

    spawn_mob(mob_name, health){
        let coords = this.get_spawn_coord()
        let mob = this.sprite_lever.sprite(coords.x, coords.y, mob_name);
        let mobby = new Mob(mob, mob_name, health)
        this.mob_box.push(mobby)
    }

    get_spawn_coord(){
        let coords = [{x:200, y:299},{x:100, y:199},{x:140, y:399}]
        return coords[Math.floor(Math.random()*coords.length)]
    }

}



// create a new scene named "One"
let sceneOne = new Phaser.Scene('One');



var map, waveTiles, groundTiles, waveLayer, groundLayer, countdown, changed;
var camera;

var gameRunning = true

sceneOne.init = function(){
    this.playerSpeed = 1.5
    this.enemySpeed = 2
}

sceneOne.preload = function(){
    
    this.load.plugin('AnimatedTiles', '../src/animated-tiles.js');
    this.load.setBaseURL('./assets/');
    this.load.tilemapTiledJSON('map', 'sma-loris.json');
    this.load.image('ground_tiles', 'ground_tiles.png');
    this.load.image('beach_sand_woa3', 'beach_sand_woa3.png');
    this.load.image('pixel', 'pixel.png')
    this.load.image('bar', 'bar.png')
    this.lastPress = false


    this.load.spritesheet('loris', 'loris-sprite.png', { frameWidth: 45, frameHeight: 45 });
    this.load.spritesheet('wolf', 'betterwolfsprite.png', {frameWidth: 70, frameHeight: 70})
    console.log("preload finished")
}
var shakeTime = 0

sceneOne.create = function(){
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
    this.health_bottom = this.add.image(50, 40, 'pixel').setScrollFactor(0)
    this.health_bottom.scaleX = -260
    this.health_bottom.scaleY = 20

    this.health_top = this.add.image(50, 40, 'pixel').setScrollFactor(0)
    console.log("health image")
    console.log(this.health_top)
    this.health_top.scaleX = -260
    this.health_top.scaleY = 20
    console.log("Health bar:")
    
    lebar = this.add.image(180,30, "bar").setScrollFactor(0)
    lebar.scaleX = 3
    lebar.scaleY = 2
    console.log(this.health_top)

    this.health_top.setTint(0xff0000)
    //Add Cameras
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

    //Create Dungeon Master
    this.DM = new dungeonMaster("wolf", 3, 7, this.physics.add)

    player.setBounce(0.2);
    console.log("Game Object:")
    console.log(game)


    player.setCollideWorldBounds(true);
    player.body.setGravityY(0)

    //Create Mob

    wolfAnims(this.anims)
    playerAnims(this.anims)

    //  Example for adding sprites
    // stars = this.physics.add.group({
    //     key: 'star',
    //     repeat: 11,
    //     setXY: { x: 12, y: 0, stepX: 70 }
    // });
    
    // stars.children.iterate(function (child) {
    
    //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
    // });


    // logo.setVelocity(100,50);
    // logo.setBounce(1, .98);
    // logo.setCollideWorldBounds(true);

    // emitter.startFollow(logo);

    // countdown 5 sek until change
    countdown = 5000;
}

sceneOne.update = function(time, delta){
    if( Loris.health <= 0 && gameRunning ){
        gameOver()
    }
    // this.health_bottom.scaleX = 7000
    // this.health_bottom.scaleY =1000
    
    // health_bottom.scale.y = 10
    // health_top.scaleMode = 1
    // health_bottom.name = "health_bottom"
    // health_top.name = "health_top"
    // health_top.width = 70
    // health_top.height = 10
    

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

function wolfAnims(animation){
    animation.create({
        key: 'wolf-walk-left',
        frames: animation.generateFrameNumbers('wolf', { start: 14, end: 18 }),
        frameRate: 10,
        repeat: -1
    });

    animation.create({
        key: 'wolf-walk-right',
        frames: animation.generateFrameNumbers('wolf', { start: 1, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    animation.create({
        key: 'wolf-walk-down',
        frames: animation.generateFrameNumbers('wolf', { start: 6, end: 9 }),
        frameRate: 10,
        repeat: -1
    });

    animation.create({
        key: 'wolf-walk-up',
        frames: animation.generateFrameNumbers('wolf', { start: 19, end: 22 }),
        frameRate: 10,
        repeat: -1
    });

}

function playerAnims(animation){
    animation.create({
        key: 'player-left',
        frames: animation.generateFrameNumbers('loris', { start: 3, end: 5 }),
        frameRate: 5,
        repeat: -1
    });

    animation.create({
        key: 'player-right',
        frames: animation.generateFrameNumbers('loris', { start: 6, end: 8 }),
        frameRate: 5,
        repeat: -1
    });

    animation.create({
        key: 'player-up',
        frames: animation.generateFrameNumbers('loris', { start: 9, end: 11 }),
        frameRate: 5,
        repeat: -1
    });

    animation.create({
        key: 'player-down',
        frames: animation.generateFrameNumbers('loris', { start: 0, end: 2 }),
        frameRate: 5,
        repeat: -1
    });

    animation.create({
        key: 'player-down-stop',
        frames: [ { key: 'loris', frame: 0 } ],
        frameRate: 20
    });
    animation.create({
        key: 'player-up-stop',
        frames: [ { key: 'loris', frame: 9 } ],
        frameRate: 20
    });
    animation.create({
        key: 'player-left-stop',
        frames: [ { key: 'loris', frame: 3 } ],
        frameRate: 20
    });
    animation.create({
        key: 'player-right-stop',
        frames: [ { key: 'loris', frame: 6 } ],
        frameRate: 20
    });
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
        this.player.anims.play("player-left", true)
        this.lastPress = "left"

    }else if (rightKey.isDown){
        x += distance
        this.player.anims.play("player-right", true)
        this.lastPress = "right"
    }
    else if (upKey.isDown){
        y -= distance
        this.player.anims.play("player-up", true)
        this.lastPress = "up"
        
    }
    else if(downKey.isDown){
        y += distance
        player.anims.play("player-down", true)
        this.lastPress = "down"
    }else{
        if(this.lastPress){
            animation = "player-"+this.lastPress+"-stop"

        }else{
            animation = "player-up-stop"
        }
        player.anims.play(animation, true)
        
    }
    moveObject(player, x, y)

}

function moveWolf(mob, x, y){

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
    scene: sceneOne
};
var game = new Phaser.Game(config);