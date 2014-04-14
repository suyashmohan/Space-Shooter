
(function(){
	var WIDTH = 800;
	var HEIGHT = 480;

	var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game');

	var mainState = {
		preload : function(){
			game.load.spritesheet('ship','assets/Spritesheet_64x29.png',64,29,4);
		},

		create : function(){
			this.ship = game.add.sprite(10,HEIGHT/2, 'ship');
			this.ship.animations.add('move');
			this.ship.animations.play('move', 20, true);
		},

		update : function(){

		}
	}

	game.state.add('main', mainState);
	game.state.start('main');
})();