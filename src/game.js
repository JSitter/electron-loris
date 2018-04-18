//Trying to break these into separate file isn't working
class Player{
    constructor(sprite){
        this.starting_health = 100
        this.cooldown = 100
        this.health = this.starting_health
        this.sprite = sprite
        this.x = 0
        this.y = 0
    }

    setPosition(x,y){
        this.x = x
        this.y = y
    }

    injure(damage){
        this.health -= damage
        //this.health_top.scaleX = (260 * damage / 100)/2
    }

    getPosition(){
        return {x:this.sprite.x, y:this.sprite.y}
    }

}

class Mob{
    constructor(sprite, name, health, damage, cool_down, path_finder, timer){

        this.sprite = sprite
        this.name = name
        this.health = health
        this.damage = damage
        this.cool_down_time = cool_down
        this.attack_time = 0
        this.direction = "left"
        this.x = sprite.x
        this.y = sprite.y
        this.target = false
        this.player = false
        this.last_time = 0
        this.Finder = path_finder
        this.walk_velocity = 32
        this.run_velocity = 90
        this.timer = timer
        this.direction = "N"
        this.hostile = false

        console.log(name + " spawned")
        this.sprite.setCollideWorldBounds(true)

    }
    injure(damage, Character){
        this.health -= damage
        if( this.health <=0){
            this._deathSequence()
        }
        return this.health
    }
    _deathSequence(){
        sprite.anims.play(this.name+'-death-'+this.direction)
    }

    tick(time, Player){
        //Mob tick

        let player_dist = 7878//distTo(Player, this.sprite.x, this.sprite.y)
        
        if(player_dist<50){
            this.sprite.anims.play('wolf-howl-left')
            console.log("I See Lunch!")
            this.attack(Player, player_dist)
        }else if(this.hostile){
            dist = distTo(this.hostile, this.sprite.x, this.sprite.y)
            this.attack(this.hostile, distance)
        }else{
            this.mobStuff(time)
        }


    }
    mobStuff(time){
        
        let mill_pause = 300
        if((time - mill_pause)>=this.last_time){
            this.last_time = time
            if(Math.random()<.1){
                this.explore()
            }else if(Math.random()<.2){
                this.turnRandom()
            }

        }
    }
    turnRandom(){
        let rand = Math.random()
        if(rand < .25){
            this.direction = "up"
        }else if(rand < .5){
            this.direction = "left"
        }else if(rand < .75){
            this.direction = "down"
        }else{
            this.direction = "right"
        }
        this.sprite.anims.play(this.name+'-stop-'+this.direction)
    }

    randomWalkCoord(){
        // console.log(this.name + " choosing point")
        let valid_point = false
        let signProb = Math.random()
        //determine direction
        let x_direction
        let y_direction
        if(signProb < .25){
            x_direction = -1
            y_direction = -1
        }else if(signProb < .5){
            x_direction = -1
            y_direction = 1
        }else if(signProb<.75){
            x_direction = 1
            y_direction = -1
        }else{
            x_direction = 1
            y_direction = 1
        }
        let block_size = 32
        let max_rolls = 4
        let roll = 0
        //Randomly choose valid point
        while(!valid_point){
            
            let random_x =  Math.floor(5*block_size + (10*block_size)*Math.random())  // num is random integer, from 20 to 30 
            let random_y =  Math.floor(5*block_size + (10*block_size)*Math.random())
            var abs_x = this.sprite.x + 48 + random_x
            var abs_y = this.sprite.y + 24 + random_y

            if((abs_x >= 0) && (abs_y >= 0)){
                valid_point = true
                
            }
            roll++
            // console.log("Roll: " + String(roll))
            if( roll >= max_rolls){
                valid_point = true
                abs_x = this.x
                abs_y = this.y
            }
        }
        return {
            x: abs_x,
            y: abs_y
        }
        
    }

    explore(){
        // console.log(this.name + " exploring things")
        let coord = this.randomWalkCoord()
        // console.log("time to go")
        this.walkDirection(coord.x, coord.y)
        
        
        // this.walkPath(path, function(arrive_time){
        //     let timedEvent = this.timer.delayedCall(arrive_time, this.stopMovement, [this.sprite], this)
        // })


    }

    walkDirection(abs_x, abs_y){
        let fromX = Math.floor(this.x / 32)
        let fromY = Math.floor(this.y / 32)
        let toX = Math.floor(abs_x/32)
        let toY = Math.floor(abs_y/32)
        let that = this

        let direction = this.getMoveDirection(fromX, fromY, toX, toY)
        console.log("Direction")
        console.log(direction)
        this.sprite.anims.play('wolf-walk-'+direction)

        try{
            this.Finder.findPath(fromX, fromY,toX, toY, function( path ) {
            
                if(path.length == 0){
                    // console.log("I'm going to stay here.")
                    
                }
    
                if (path === null) {
                    // console.warn("Path was not found.");
                    
                        
                } else {
                    // console.log("Path Found! Huzzah!"+ path.length)


                    that.walkPath(path, function(walktime){
                        // console.log("Timer object")
                        // console.log(that.timer)
                        // console.log(walktime)
                        //that.timer.delayedCall(walktime*1000, that.stopMovement, [], that)
                        // let direction = that.getMoveDirection(fromX, fromY, toX, toY)
                        // console.log("Direction")
                        // console.log(direction)
                        // that.sprite.anims.play(that.name+'-walk-'+direction)
                    }) 
                    
                }
            });
            this.Finder.calculate();
        }catch(err){
            console.warn(err.message)
        }


    }

    walkPath(path, callback){
        //move to path
        // console.log(this.name + " X pixel position: " + this.sprite.x)
        // console.log(this.name + " Y pixel position: " + this.sprite.y)
        // console.log(this.name + " X tile position: " + Math.floor(this.sprite.x/32))
        // console.log(this.name + " Y tile position: " + Math.floor(this.sprite.y/32))
        // console.log("First Path X component: " + path[0].x)
        // console.log("First Path Y component: " + path[0].y)
        
        if(path.length == 0){
            //No path to follow
        }else{
            let that = this
            let time = this.walkLine(this.sprite, path[1].x+1, path[1].y+1)
            callback(time)
        }
    }

    walkLine(sprite, x, y){
        x = x*32
        y = y*32

        let angle = Math.atan2(y - sprite.y, x - sprite.x);
        let distance = distTo(sprite, x, y)
        console.log("distance to unknown: "  + distance)
        let time = distance / this.walk_velocity
        
        sprite.setVelocityX(Math.cos(angle) * this.walk_velocity);
        sprite.setVelocityY(Math.sin(angle) * this.walk_velocity);
        return time
    }

    getMoveDirection(fromX, toX, fromY, toY){
        if(Math.abs(fromX - toX)>Math.abs(fromY-toY)){
            if(fromX > toX){
                return "right"
            }else{
                return "left"
            }
        }else{
            if(fromY > toY){
                return "down"
            }else{
                return "up"
            }
        }
            
        
    }

    stopMovement(){
        console.log("stopped")
        this.sprite.setVelocityX(.1)
        this.sprite.setVelocityY(.1)
    }

    attack(Character){
        let distance = distTo(this.sprite, Character.sprite.x, Character.sprite.y)
        // console.log("Computed distance:  "+ distance)

        if(distance < 45){
            // console.log("Cooldown time: " + this.cool_down_time)
            // console.log(this.attack_time + this.cool_down_time)
            // console.log(this.timer.now)
            if(Math.floor(this.attack_time + this.cool_down_time) < Math.floor(this.timer.now)){
                console.log("INJURE!")
                console.log(this.damage)
                this.sprite.anims.play(this.name+'-howl-left')
                Character.injure(this.damage)
                this.attack_time = this.timer.now
            }
            
            // console.log("Timer time now:")
            // console.log(this.timer.now)
        }
        // console.log("ATTACKZ!")
        this.runToPoint(Character.sprite.x, Character.sprite.y)
        
    }

    runToPoint(x, y){

        let angle = Math.atan2(y - this.sprite.y, x - this.sprite.x);
        let distance = distTo(this.sprite, x, y)
        // console.log("distance to run: "  + distance)
        let time = distance / this.run_velocity
    
        this.sprite.setVelocityX(Math.cos(angle) * this.run_velocity);
        this.sprite.setVelocityY(Math.sin(angle) * this.run_velocity);
        //this.timer.set

    }

    runFromPoint(x, y){

        let angle = Math.atan2(y - this.sprite.y, x - this.sprite.x);
        let distance = distTo(this.sprite, x, y)
        console.log("distance to run: "  + distance)
        let time = distance / this.run_velocity
    
        this.sprite.setVelocityX(-1*Math.cos(angle) * this.run_velocity);
        this.sprite.setVelocityY(-1*Math.sin(angle) * this.run_velocity);
        //this.timer.set

    }
    
}

class dungeonMaster{
    constructor(name, num_mobs, spawn_period, sprite_pipe, path_finder, Player, timer){
        //Spawn Period is in time minutes
        this.name = name
        this.num_mobs = num_mobs
        this.spawn_period = spawn_period
        this.creation_time = false
        this.mob_box = []
        this.dead_mobs = []
        this.sprite_pipe = sprite_pipe
        this.Finder = path_finder
        this.Player = Player
        this.timer = timer

        while( this.mob_box.length  < num_mobs){
            this.spawn_mob("wolf", 100 , 28)
        }
    }

    tick(time, delta){

        //dm tick
        if(this.mob_box.length<this.num_mobs){
            this.mob_roll(time)
        }
        let min_dist = 25

        //for some reason it seems the distance is off by 48 in the x and 24 in the y direction
        for( var index in this.mob_box){
            let mob = this.mob_box[index]
            
            let distance = distTo(this.Player.sprite, mob.x, mob.y)
            // console.log("Player distance: " + distance)

            //Either Hostile or Not based on distance
            if(distance < 215){
                mob.attack(this.Player, distance)
            }else{
                this.mob_box[index].tick(time, this.Player)
            }
           
        }
       
    }

    check_player_dist(x, y){
        let x_dist = this.Player.sprite.x - x
        let y_dist = this.Player.sprite.y  - y
        let x_2 = x_dist *x_dist
        let y_2 = y_dist*y_dist
        let square_dist = x_2 + y_2
        let distance = Math.sqrt(square_dist)

        // console.log("Player distance: " + distance)
        // console.log(x_dist)
        return distance
    }

    mob_roll(time, delta){
        roll = Math.random(time)
        mob_prob = (delta/ this.spawn_period * 60000)
        if(roll <= mob_prob){
            //spawn mob
            this.spawn_mob('wolf', 10, 28)
        }
    }

    spawn_mob(mob_name, health, damage){
        let coords = this.get_spawn_coord()
        let mob = this.sprite_pipe.sprite(coords.x, coords.y, mob_name);
        let mobby = new Mob(mob, mob_name, health, damage, 1000, this.Finder, this.timer)
        this.mob_box.push(mobby)
    }

    get_spawn_coord(){
        let coords = [{x:200, y:299},{x:100, y:199},{x:140, y:399}, {x:465, y:10}, {x:600, y:500}, {x:560, y:467}]
        //return random coordinate
        return coords[Math.floor(Math.random()*coords.length)]
    }

}

// create a new scene named "One"
let sceneOne = new this.Phaser.Scene('One');

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
    this.load.image('gameover', 'gameover.png')
    this.lastPress = false
    this.Finder = new EasyStar.js()
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
    console.log("Map Object")
    console.log(map)
    groundTiles = map.addTilesetImage('avalon-ground', 'ground_tiles' )
    waveTiles = map.addTilesetImage('av-waves-3', 'beach_sand_woa3' )
    console.log("go fetch Avalon Ground tiles")
    console.log(groundTiles)
    groundLayer = map.createDynamicLayer('Base', groundTiles, 0, 0);
    waveLayer = map.createDynamicLayer('waves', waveTiles, 0, 0);


    groundLayer.setScale(1)
    console.log("Charmed - Animated Tiles ")
    // Init animations on map
    // this.sys.animatedTiles.init(map);

    
    //EasyStar Pathfinding library
    // console.log("properties")
    // console.log(groundTiles.tileProperties)
    // console.log("ground layer index at...blah")
    // console.log(groundLayer.getTileAt(4,5, true).index)

    
    grid = createGrid(groundLayer)
    let acceptableTiles = getAcceptableTiles(groundTiles, this.Finder)

    this.Finder.setAcceptableTiles(acceptableTiles);
    this.Finder.setGrid(grid)

    //Add Health Bar
    this.health_bottom = this.add.image(50, 40, 'pixel').setScrollFactor(0)
    this.health_bottom.scaleX = -260
    this.health_bottom.scaleY = 20

    this.health_top = this.add.image(50, 40, 'pixel').setScrollFactor(0)
    // console.log("health image")
    // console.log(this.health_top)
    this.health_top.scaleX = -260
    this.health_top.scaleY = 20
    // console.log("Health bar:")
    
    lebar = this.add.image(180,30, "bar").setScrollFactor(0)
    lebar.scaleX = 3
    lebar.scaleY = 2
    // console.log(this.health_top)

    this.health_top.setTint(0xff0000)
    //Add Cameras
    camera = this.cameras.main.setSize(800, 800)


    console.log("Main Camera")
    console.log(this.cameras.main)
    // camera = this.cameras.add();
   
    gameOverText = this.add.text(0, 0, 'GAME OVER', { font: '84px Arial', fill: '#fff' });
    // gameOverText.anchor.setTo(0.5, 0.5);
    gameOverText.visible = false;

    console.log("Gamve 0over textg")
    console.log(gameOverText)

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
    console.log("Player Class Instance")
    this.Player = new Player(player)
    console.log(this.Player)

    //Create Dungeon Master
    this.DM = new dungeonMaster("wolf", 4, 7, this.physics.add, this.Finder, this.Player, this.time)

    player.setBounce(0.2);
    console.log("Game Object:")
    console.log(game)


    player.setCollideWorldBounds(true);


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
    updateHealthBar(this.health_top, this.Player.health)
    if( this.Player.health <= 0 && gameRunning ){
        gameOver()
    }

    

    if (shakeTime > 0)
    {
        shakeTime -= delta;

        this.cameras.main.shake(500);
    }
    let player_move_amt = 60

    movePlayer(leftKey, rightKey, upKey, downKey, player_move_amt)
    this.DM.tick(time, delta)

    //This is for animated tiles
    countdown-=delta;
    // countdown is done, but the change hasn't been done
    if(countdown <0 && !changed){
        console.log("log T")
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

function getAcceptableTiles(tileset, pathfinderObj){
    //This function will work on maps and tilesets
    let properties = tileset.tileProperties

    var acceptableTiles = []

    for(var i = tileset.firstgid-1; i < tileset.total; i++){ // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
            if(!properties.hasOwnProperty(i)) {
                // If there is no property indicated at all, it means it's a walkable tile
                acceptableTiles.push(i+1)
                continue;
            }
            if(!properties[i].collide) acceptableTiles.push(i+1)
            if(properties[i].cost) pathfinderObj.setTileCost(i+1, properties[i].cost) // If there is a cost attached to the tile, let's register it
        }
    console.log("Acceptable tiles")
    // console.log(acceptableTiles)
    return acceptableTiles
}

function wolfAnims(animation){
    animation.create({
        key: 'wolf-walk-left',
        frames: animation.generateFrameNumbers('wolf', { start: 13, end: 17 }),
        frameRate: 10,
        repeat: -1
    });

    animation.create({
        key: 'wolf-walk-right',
        frames: animation.generateFrameNumbers('wolf', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    animation.create({
        key: 'wolf-walk-down',
        frames: animation.generateFrameNumbers('wolf', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    animation.create({
        key: 'wolf-walk-up',
        frames: animation.generateFrameNumbers('wolf', { start: 18, end: 21 }),
        frameRate: 10,
        repeat: -1
    });

    animation.create({
        key: 'wolf-howl-left',
        frames: animation.generateFrameNumbers('wolf', { start: 9, end: 11 }),
        frameRate: 10,
        repeat: 1
    });

    animation.create({
        key: 'wolf-stop-up',
        frames: [ { key: 'wolf', frame: 18 } ],
        frameRate: 20
    });
    animation.create({
        key: 'wolf-stop-down',
        frames: [ { key: 'wolf', frame: 5 } ],
        frameRate: 20
    });
    animation.create({
        key: 'wolf-stop-left',
        frames: [ { key: 'wolf', frame: 13 } ],
        frameRate: 20
    });
    animation.create({
        key: 'wolf-stop-right',
        frames: [ { key: 'wolf', frame: 0 } ],
        frameRate: 20
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
}

function moveObject( something, x, y){
    something.setVelocityX(x)
    something.setVelocityY(y)

}

function gameOver(){
    shakeTime = 2000
    gameRunning = false
    console.log("ded")
    console.log(this.systemshock)
    console.log("Camera")
    console.log(camera)
    console.log("gamover text")
    console.log(gameOverText)
    gameOverText.x = camera.scrollX + (camera.width/2)-280
    gameOverText.y = camera.scrollY + (camera.height/2)-150
    gameOverText.visible = true
    
    let grand_event = function(){
        this.player.destroy()
    }
    //this.player.destroy
    setTimeout(grand_event, 3000)
    //this.timedEvent = this.time.delayedCall(2000, grand_event, [], this);
    
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

function distTo(character, cur_x, cur_y){
    if(character){
        let x = character.x
        let y = character.y
        let x_dist = cur_x - x
        let y_dist = cur_y - y
        let x_2 = x_dist*x_dist
        let y_2 = y_dist*y_dist
        let square_dist = x_2 + y_2
        let distance = Math.sqrt(square_dist)
        // console.log("The distance is:")
        // console.log(distance)
        return distance
    }else{
        console.warn("Character not passed in")

    }
    return 999999
}

function updateHealthBar(bar, player_health){
    let full_health = 100
    if(player_health <= 0){
        bar.scaleX = 0
    }else{
        bar.scaleX = -player_health/full_health*260
    }
    
}

function createGrid(map){

    var grid = [];
    for(var y = 0; y < map.tilemap.height; y++){
        var col = [];
        for(var x = 0; x < map.tilemap.width; x++){

            // In each cell we store the ID of the tile, which corresponds
            // to its index in the tileset of the map ("ID" field in Tiled)
            col.push(map.getTileAt(x,y, true).index);
        }
        grid.push(col);
    }
    return grid

}

function moveWolf(mob, x, y){

}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    backgroundColor:'#e5cb91',
    parent: 'slow-loris-game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: sceneOne
};
var game = new Phaser.Game(config);