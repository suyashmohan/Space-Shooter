
(function(){
	var WIDTH = 800;
	var HEIGHT = 480;

	var _game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game');

	var mainState = {
		preload : function(){
			this.game.load.image('bullet','assets/bullet.png');
			this.game.load.image('bgSpace','assets/farback.jpg');
			this.game.load.image('bgSpace2','assets/starfield.png');
			this.game.load.spritesheet('ship','assets/Spritesheet_64x29.png',64,29,4);
			this.game.load.spritesheet("enemyship1","assets/eSpritesheet_40x30.png",40, 30, 6);
			this.game.load.spritesheet("enemyship2","assets/eSpritesheet_40x30_hue1.png",40, 30, 6);
			this.game.load.spritesheet("enemyship3","assets/eSpritesheet_40x30_hue2.png",40, 30, 6);
			this.game.load.spritesheet("enemyship4","assets/eSpritesheet_40x30_hue3.png",40, 30, 6);
			this.game.load.spritesheet("enemyship5","assets/eSpritesheet_40x30_hue4.png",40, 30, 6);
		},

		create : function(){
			this.lastBullet = 0;
			this.lastEnemy = 0;
			this.lastTick = 0;
			this.speed = 100;
			this.bg1Speed = 30;
			this.bg2Speed =40;
			this.bg3Speed =50;
			this.enemySpeed = 200;
			this.bulletSpeed = 300;
			this.lives = 3;
			this.score = 0;

			this.game.physics.startSystem(Phaser.Physics.ARCADE);

			this.bg = this.game.add.tileSprite(0,0,1782,600,'bgSpace');
			this.bg.autoScroll(-this.bg1Speed,0);

			this.bg2 = this.game.add.tileSprite(0,0,800,601,'bgSpace2');
			this.bg2.autoScroll(-this.bg2Speed,0);

			this.bg3 = this.game.add.tileSprite(0,0,800,601,'bgSpace2');
			this.bg3.autoScroll(-this.bg3Speed,0);

			this.ship = this.game.add.sprite(10,HEIGHT/2, 'ship');
			this.ship.animations.add('move');
			this.ship.animations.play('move', 20, true);
			this.game.physics.arcade.enable(this.ship, Phaser.Physics.ARCADE);

			this.bullets = this.game.add.group();
			this.bullets.enableBody = true;
			this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
			this.bullets.createMultiple(10,'bullet');			
    		this.bullets.setAll('outOfBoundsKill', true);
    		this.bullets.setAll('checkWorldBounds', true);

			this.enemies = this.game.add.group();
			this.enemies.enableBody = true;
			this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

			var style = { font: "28px Arial", fill: "#DE5F3D", align: "left" };
			this.scoreText = this.game.add.text(0,0,"Score : "+this.score,style);
			this.livesText = this.game.add.text(0,28,"Lives : "+this.lives,style);
		},

		update : function(){
			this.ship.body.velocity.setTo(0,0);
			if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.ship.x > 0)
			{
				this.ship.body.velocity.x = -2*this.speed;
			}
			else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.ship.x < (WIDTH-this.ship.width))
			{
				this.ship.body.velocity.x = this.speed;
			}
			else if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP) && this.ship.y > 0)
			{
				this.ship.body.velocity.y = -this.speed;
			}
			else if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && this.ship.y < (HEIGHT-this.ship.height))
			{
				this.ship.body.velocity.y = +this.speed;
			}

			var curTime = this.game.time.now;

			if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
			{
				if(curTime - this.lastBullet > 300)
				{
					this.fireBullet();
					this.lastBullet = curTime;
				}
			}

			if(curTime - this.lastEnemy > 500)
			{
				this.generateEnemy();
				this.lastEnemy = curTime;
			}

			if(curTime - this.lastTick > 10000)
			{
				if(this.speed < 500)
				{
					this.speed *= 1.1;
					this.enemySpeed *= 1.1;
					this.bulletSpeed *= 1.1;
					this.bg.autoScroll(-this.bg1Speed, 0);
					this.bg2.autoScroll(-this.bg2Speed, 0);
					this.bg3.autoScroll(-this.bg3Speed, 0);
					this.lastTick = curTime;
				}
			}

			this.game.physics.arcade.collide(this.enemies, this.ship, this.enemyHitPlayer,null, this);
			this.game.physics.arcade.collide(this.enemies, this.bullets, this.enemyHitBullet,null, this);
		},

		fireBullet : function(curTime){
			var bullet = this.bullets.getFirstExists(false);
			if(bullet)
			{
				bullet.reset(this.ship.x+this.ship.width,this.ship.y+this.ship.height/2);
				bullet.body.velocity.x = this.bulletSpeed;
			}
		},

		generateEnemy : function(){
			var enemy = this.enemies.getFirstExists(false);
			if(enemy)
			{
				enemy.reset(WIDTH - 30,Math.floor(Math.random()*(HEIGHT-30)),'enemyship'+(1+Math.floor(Math.random()*5)));
			}
			else
			{
				enemy = this.enemies.create(WIDTH - 30,Math.floor(Math.random()*(HEIGHT-30)),'enemyship'+(1+Math.floor(Math.random()*5)));
			}
			enemy.body.velocity.x = -this.enemySpeed;
			enemy.outOfBoundsKill = true;
			enemy.checkWorldBounds = true;
			enemy.animations.add('move');
			enemy.animations.play('move',20,true);
		},

		enemyHitPlayer : function(player, enemy){
			if(this.enemies.getIndex(enemy) > -1)
				this.enemies.remove(enemy);
			enemy.kill();
			this.lives -= 1;
			this.livesText.setText("Lives : "+this.lives);
			if(this.lives < 0)
				this.game.state.start('menu');
		},

		enemyHitBullet : function(bullet, enemy){
			if(this.enemies.getIndex(enemy) > -1)
				this.enemies.remove(enemy);
			enemy.kill();
			bullet.kill();
			this.score += 10;
			this.scoreText.setText("Score : "+this.score);
		}
	}

	var menuState = {
		preload : function(){
			this.game.load.image('bgSpace','assets/farback.jpg')
		},

		create : function(){
			this.speed = 10;

			this.bg = this.game.add.tileSprite(0,0,1782,600,'bgSpace');
			this.bg.autoScroll(-this.speed,0);

			var style = { font: "48px Arial", fill: "#DE5F3D", align: "center" };
			this.title = this.game.add.text(250,170,"Space Shooter",style);

			var style2 = { font: "28px Arial", fill: "#DE5F3D", align: "center" };
			this.help = this.game.add.text(250,230,"Press `Enter` Key to start",style2);
		},

		update : function(){
			if(this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
				this.game.state.start('main');
		}
	}

	_game.state.add('main', mainState);
	_game.state.add('menu', menuState);
	_game.state.start('menu');
})();