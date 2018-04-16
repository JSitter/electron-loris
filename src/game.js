//Trying to break these into separate file isn't working
class Player{
    constructor(sprite){
        this.starting_health = 100
        this.cooldown = 2000
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
    }



    getPosition(){
        return {x:this.sprite.x, y:this.sprite.y}
    }


}

class Mob{
    constructor(sprite, name, health, damage, cool_down, path_finder){

        this.sprite = sprite
        this.name = name
        this.health = health
        this.damage = damage
        this.cool_down_length = cool_down
        this.cool_down_until = 0
        this.direction = "left"
        this.x = sprite.x
        this.y = sprite.y
        this.target = false
        this.player = false
        this.last_time = 0
        this.Finder = path_finder
        this.walk_velocity = 32
        this.run_velocity = 6

        console.log(name + " spawned")
        this.sprite.setCollideWorldBounds(true)

    }
    injure(damage){
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

        let player_dist = distTo(Player, this.sprite.x, this.sprite.y)
        
        
        if(player_dist<50){
            this.sprite.anims.play('wolf-howl-left')
            console.log("I See Lunch!")
            this.attack(Player, player_dist)
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
            
            let random_x =  Math.floor(2*block_size + (3*block_size)*Math.random())  // num is random integer, from 20 to 30 
            let random_y =  Math.floor(2*block_size + (3*block_size)*Math.random())
            var abs_x = this.x + random_x
            var abs_y = this.y + random_y

            if((abs_x >= 0) && (abs_y >= 0)){
                valid_point = true
                
            }
            roll++
            console.log("Roll: " + String(roll))
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
        console.log(this.name + " exploring things")
        let coord = this.randomWalkCoord()
        let that = this
        this.computePath(coord.x, coord.y).then(function(path){
            console.log("time to go")
            that.walkPath(path)
            // console.log("Path legth? " + path.length)
            // console.log(path.length)
            // if( path.length > 0){
            //     console.log(this.name + " walking")
            //     this.walkPath(path)
            // }else{
            //     console.log("Well here might be fine...")
            // }
        }).catch((err)=>{
            console.log("err")
            console.warn("Error getting path: " + err.message)

        })        

    }

    computePath(abs_x, abs_y){
        let that = this
        return new Promise(function(resolve, reject){

            // console.log(that.name + " smells something over there.")
            // console.log(abs_x)
            // console.log(abs_y)
            let fromX = Math.floor(that.x / 32)
            let fromY = Math.floor(that.y / 32)
            let toX = Math.floor(abs_x/32)
            let toY = Math.floor(abs_y/32)
            let fun_path
            
            // console.log("Computing relative path to absolute:")
            // console.log(String(abs_x) + " " + String(abs_y))
            // console.log("Relative coords:")
            // console.log(String(toX) + " " + String(toY))
            
            
            that.Finder.findPath(fromX, fromY,toX, toY, function( path ) {
                
                if(path.length == 0){
                    console.log("I'm going to stay here.")
                    resolve([])
                }

                if (path === null) {
                    console.warn("Path was not found.");
                    resolve([])
                        
                } else {
                    console.log("Path Found! Huzzah!"+ path.length)
                    
                    fun_path = path
                    // console.log(fun_path)
                    resolve(fun_path)
                    
                }
            });
            that.Finder.calculate();

        })
        
    }

    walkPath(path){
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
            this.walkLine(that.sprite, path[1].x+1, path[1].y+1)
                .then(function(walking){
                    // console.log(walking)
                    // console.log("walking " + walking.animate_direction)
                    that.sprite.anims.play(that.name+"-walk-"+walking.animate_direction)
                    moveObject(that.sprite, walking.velocity_x, walking.velocity_y)

                    
                    setTimeout(function(){
                        //moveObject(that.sprite, 0, 0)
                        
                        that.sprite.anims.play(this.name+"-stop-"+walking.animate_direction)
                        //that.sprite.setVelocity(0,0)
                        // that.sprite.setVelocityX(0)
                        // that.sprite.setVelocityY(0)
                    },walking.animation_time*1000)

                }).catch((err)=>{
                    console.warn(err.message)
                })

        }


    }

    walkLine(sprite, x, y){
        // console.log("I walk the line")
        // console.log("point x: " + x)
        // console.log("Point y: " + y)
        let that = this

        return new Promise(function(resolve, reject){
            // console.log("Sprity spirte")
            // console.log(that.sprite)
            // that.moveObject(sprite, 20, 21)

            let tile_size = 32
            //Cur_x and cur_y are pixel coordinates of the current sprite
            //Because the sprite position is being given from the middle of the sprite
            //  remove half the sprite distance from x and y pixel positions 
            var cur_x = that.sprite.x + 1 - 16
            var cur_y = that.sprite.y + 1 - 16

            // console.log("Sprite X: " + cur_x)
            // console.log("Sprite Y: " + cur_y)
            // console.log("Dest X:", x)
            // console.log("Dest Y:", y)
            // console.log("Dest X pixels: " + x*tile_size)
            // console.log("Dest Y pixels: " + y*tile_size)

            //Remap global coordinate system to something more manageable
            //use dist_x and dist_y for magnitude of directional components
            var dist_x = x*tile_size - cur_x
            let x_2 = dist_x*dist_x

            var dist_y = y*tile_size - cur_y
            let y_2 = dist_y*dist_y

            // console.log("dest pixel x component:"+dist_x)
            // console.log("dest pixel y component:"+dist_y)

            var square_dist = x_2 + y_2
            var distance = Math.sqrt(square_dist)
            // console.log("Distance to Point: " + distance)
            let velocity_x
            let velocity_y
            
            // console.log("Tile x coors " + sprite.x/32 )
            // console.log("Tile y coors " + sprite.y/32 )
            // console.log("Bearing in Degrees...just kidding" )
            
            // var x_sign = (dist_x < 0) ? -1 : 1
            // var y_sign = (dist_y < 0) ? 1 : -1
            // console.log("X sign : " + x_sign)
            // console.log("Y sign: " + y_sign)
            var scale_factor = distance / that.walk_velocity
            if(scale_factor != 0){
                velocity_x = dist_x/scale_factor
                // console.log("v x calculation:")
                // console.log(velocity_x)
                velocity_y = dist_y/scale_factor
            }else{
                velocity_x = 0
                velocity_y = 0
            }

            
            let animation_time = distance / that.walk_velocity  // some unit of time

            let animate_direction

            //console.log("Choose direction to move the leggles")
            if((x_2) > (y_2)){
                if(dist_x>0){
                    animate_direction = "right"

                }else{
                    animate_direction = "left"
                }
            }else{
                if(dist_y>0){
                    animate_direction = "down"
                }else{
                    animate_direction = "up"
                }
                
            }
            
            //console.log('Move the leggles')
            //console.log(that.walk)
            //console.log(animate_direction)
            // sprite.anims.play(that.name+"-walk-"+animate_direction)
            //console.log("Moved my legglez")
            
            // console.log("y comp")
            // console.log(velocity_x)

            // console.log("Velocity x: "+velocity_x)
            // console.log("Velocity y: "+velocity_y)

            // console.log("animation time")
            // console.log(animation_time)
            
            resolve({animation_time, animate_direction, velocity_x, velocity_y})
            
            //setTimeout(moveObject, animation_time,sprite, 0, 0)
            //setTimeout(resolve, animation_time, animate_direction, velocity_x, velocity_y)

        })

    }

    attack(character, distance){
        if(distance < 32){
            sprite.anims.play(this.name+'-howl-left')
            character.injure(10)
        }
        console.log("ATTACKZ!")
        
    }
}

class dungeonMaster{
    constructor(name, num_mobs, spawn_period, sprite_pipe, path_finder, Player){
        //Spawn Period is in time minutes
        this.name = name
        this.num_mobs = num_mobs
        this.spawn_period = spawn_period
        this.creation_time = false
        this.mob_box = []
        this.sprite_pipe = sprite_pipe
        this.Finder = path_finder
        this.Player = Player

        while( this.mob_box.length  < num_mobs){
            this.spawn_mob("wolf", 10)
        }
    }

    tick(time, delta){

        //dm tick
        if(this.mob_box.length<this.num_mobs){
            this.mob_roll(time)
        }
        let min_dist = 25
        for( var index in this.mob_box){
            this.mob_box[index].tick(time, this.Player)
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
            this.spawn_mob('wolf', 10)
        }
    }

    spawn_mob(mob_name, health){
        let coords = this.get_spawn_coord()
        let mob = this.sprite_pipe.sprite(coords.x, coords.y, mob_name);
        let mobby = new Mob(mob, mob_name, health, 10, 2000, this.Finder)
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

    console.log("Charmed - Animated Tiles ")
    // Init animations on map
    this.sys.animatedTiles.init(map);
    
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
    console.log("Player Class Instance")
    this.Player = new Player(player)
    console.log(this.Player)

    //Create Dungeon Master
    this.DM = new dungeonMaster("wolf", 4, 7, this.physics.add, this.Finder, this.Player)

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
    if( this.Player.health <= 0 && gameRunning ){
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
        key: 'wolf-walk-up',
        frames: animation.generateFrameNumbers('wolf', { start: 18, end: 21 }),
        frameRate: 10,
        repeat: -1
    });

    animation.create({
        key: 'wolf-howl-left',
        frames: animation.generateFrameNumbers('wolf', { start: 9, end: 11 }),
        frameRate: 10,
        repeat: -1
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