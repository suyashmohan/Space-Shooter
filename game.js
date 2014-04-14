
(function(){
	var WIDTH = 800;
	var HEIGHT = 480;

	var _game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game');

	var mainState = {
		preload : function(){
			this.game.load.image('bullet','assets/bullet.png');
			this.game.load.image('bgSpace','assets/farback.jpg')
			this.game.load.spritesheet('ship','assets/Spritesheet_64x29.png',64,29,4);
			this.game.load.spritesheet("enemyship1","assets/eSpritesheet_40x30.png",40, 30, 6);
			this.game.load.spritesheet("enemyship2","assets/eSpritesheet_40x30_hue1.png",40, 30, 6);
			this.game.load.spritesheet("enemyship3","assets/eSpritesheet_40x30_hue2.png",40, 30, 6);
			this.game.load.spritesheet("enemyship4","assets/eSpritesheet_40x30_hue3.png",40, 30, 6);
			this.game.load.spritesheet("enemyship5","assets/eSpritesheet_40x30_hue4.png",40, 30, 6);
		},

		create : function(){
			this.bg = this.game.add.tileSprite(0,0,1782,600,'bgSpace');
			this.bg.autoScroll(-100,0);

			this.ship = this.game.add.sprite(10,HEIGHT/2, 'ship');
			this.ship.animations.add('move');
			this.ship.animations.play('move', 20, true);

			this.bullets = this.game.add.group();
			this.bullets.enableBody = true;
			this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

			this.enemies = this.game.add.group();
			this.enemies.enableBody = true;
			this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

			this.lastBullet = 0;
			this.lastEnemy = 0;
			this.speed = 2;
			this.enemySpeed = -150;
			this.bulletSpeed = 300;
		},

		update : function(){
			var curTime = this.game.time.now;

			if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.ship.x > 0)
			{
				this.ship.x -= this.speed;
			}
			else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.ship.x < (WIDTH-this.ship.width))
			{
				this.ship.x += this.speed;
			}
			else if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP) && this.ship.y > 0)
			{
				this.ship.y -= this.speed;
			}
			else if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && this.ship.y < (HEIGHT-this.ship.height))
			{
				this.ship.y += this.speed;
			}

			if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
			{
				if(curTime - this.lastBullet > 300)
				{
					var bullet = this.bullets.create(this.ship.x + this.ship.width,this.ship.y+this.ship.height/2,'bullet');
					bullet.body.velocity.x = this.bulletSpeed;
					bullet.checkWorldBounds = true;
					var that = this;
					bullet.events.onOutOfBounds.add(function(obj){
						that.bullets.remove(obj);
					},this);
					this.lastBullet = curTime;
				}
			}

			if(curTime - this.lastEnemy > 1000)
			{
				var enemy = this.enemies.create(WIDTH - 30,Math.floor(Math.random()*(HEIGHT-30)),'enemyship'+(1+Math.floor(Math.random()*5)));
				enemy.body.velocity.x = this.enemySpeed;
				enemy.checkWorldBounds = true;
				enemy.animations.add('move');
				enemy.animations.play('move',20,true);
				var that = this;
				enemy.events.onOutOfBounds.add(function(obj){
					that.enemies.remove(obj);
				},this);
				this.lastEnemy = curTime;
			}
		}
	}

	_game.state.add('main', mainState);
	_game.state.start('main');
})();