!function(e){var r={};function t(a){if(r[a])return r[a].exports;var s=r[a]={i:a,l:!1,exports:{}};return e[a].call(s.exports,s,s.exports,t),s.l=!0,s.exports}t.m=e,t.c=r,t.d=function(e,r,a){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:a})},t.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=0)}([function(e,r){var t={type:Phaser.AUTO,width:800,height:600,physics:{default:"arcade",arcade:{gravity:{y:3},debug:!1}},scene:{preload:function(){this.load.setBaseURL("./assets/"),this.load.image("board","board.jpg"),this.load.spritesheet("loris","slow-loris.png",{frameWidth:32,frameHeight:48}),this.load.image("red","slow-loris.png")},create:function(){this.add.image(400,300,"board"),this.add.image(32,48,"red"),platforms=this.physics.add.staticGroup(),platforms.create(400,568,"red").setScale(2).refreshBody(),platforms.create(600,400,"red"),platforms.create(50,250,"red"),platforms.create(750,220,"red"),leftKey=a.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),rightKey=a.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),downKey=a.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),upKey=a.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),angleKey=a.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),player=this.physics.add.sprite(300,150,"loris"),console.log(player),player.setBounce(.2),player.setCollideWorldBounds(!0),player.body.setGravityY(3e3),player.setAngularFriction(34),this.physics.add.collider(player,platforms),this.anims.create({key:"left",frames:this.anims.generateFrameNumbers("loris",{start:0,end:3}),frameRate:10,repeat:-1}),this.anims.create({key:"turn",frames:[{key:"loris",frame:4}],frameRate:20}),this.anims.create({key:"right",frames:this.anims.generateFrameNumbers("loris",{start:5,end:8}),frameRate:10,repeat:-1})},update:function(){angleKey.isDown&&player.setAngularVelocity(400);!function(e,r,t,a,s){x=0,y=0,e.isDown&&(x-=s);r.isDown&&(x+=s);t.isDown&&(y-=s);a.isDown&&(y+=s);!function(e,r,t){e.setVelocityX(r),e.setVelocityY(t)}(player,x,y)}(leftKey,rightKey,upKey,downKey,600)}}},a=new Phaser.Game(t)}]);