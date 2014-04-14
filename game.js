
(function(){
	var WIDTH = 800;
	var HEIGHT = 480;

	var _game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game');

	var mainState = {
		preload : function(){
			this.game.load.spritesheet('ship','assets/Spritesheet_64x29.png',64,29,4);
			this.game.load.image('bullet','assets/bullet.png');
			this.game.load.image('bgSpace','assets/farback.jpg')
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

			this.lastBullet = 0;
			this.speed = 2;
		},

		update : function(){
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
				var curTime = this.game.time.now;
				if(curTime - this.lastBullet > 300)
				{
					var bullet = this.bullets.create(this.ship.x + this.ship.width,this.ship.y+this.ship.height/2,'bullet');
					bullet.body.velocity.x = 300;
					bullet.checkWorldBounds = true;
					var that = this;
					bullet.events.onOutOfBounds.add(function(obj){
						that.bullets.remove(obj);
					},this);
					this.lastBullet = curTime;
				}
			}

			//this.bg.x -= 100;
		}
	}

	_game.state.add('main', mainState);
	_game.state.start('main');
})();