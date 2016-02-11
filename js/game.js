/*GAME VARIABLES*/
var game;
var player1;
var p1shoot = 0;
var p2shoot = 0;
var noOfGamepads = 0;
var gamepad1;
var gamepad2;
var player2;
var player3;
var player4;
var aliens;
var alienCount;
var input;
var frameCount;
var spriteFrame;
var levelSpeed;
var lives;
var WLStatus;
var playerHit;
var playerCount;
var check;
var difficulty = 1;
var diffFont;

/*SPRITE VARIABLES*/
var enemySprite;
var playerSprite;
var playerSprite1;
var playerSprite2;
var playerSprite3;
var playerSprite4;
var shelterSprite;
var explosionSprite;

/*ANIMATION VARIABLES*/
var direction;
var bullets;
var shelter;

/*GLOBAL VARIABLES*/
var dirLeft = 2;
var LEFT = [37, 65, 100, 74];
var RIGHT = [39, 68, 102, 76];
var FIRE = [38, 87, 104, 73];

var PAUSE = 32;

/*SOUND VARIABLES*/
var shootSound;
var explosionSound;
var playerHitSound;
var pauseSound;
var backgroundSound;
var volume = 0.05;

/*MAIN FUNCTION*/
function main(){
	check = 0;
	game = new Game();
	input = new InputHandler();	
	
	/*LOAD SPRITES*/
	var img = new Image();
	img.addEventListener("load", function(){
		enemySprite = [[new Sprite(this,  6, 10, 24, 16), new Sprite(this,  40, 10, 24, 16)], /*ENEMY TYPE 1*/
					   [new Sprite(this, 6, 44, 24, 16), new Sprite(this, 40, 44, 24, 16)], /*ENEMY TYPE 2*/
					   [new Sprite(this, 6, 78, 24, 16), new Sprite(this, 40, 78, 24, 16)]    /*ENEMY TYPE 3*/
		];
		playerSprite = new Sprite(this, 106, 18, 28, 16);
		
		playerSprite1 = new Sprite(this, 140, 18, 28, 16);
		playerSprite2 = new Sprite(this, 174, 18, 28, 16);
		playerSprite3 = new Sprite(this, 140, 52, 28, 16);
		playerSprite4 = new Sprite(this, 174, 52, 28, 16);
		
		shelterSprite = new Sprite(this, 70, 36, 44, 18);
		explosionSprite = new Sprite(this, 74, 10, 24, 16);
	
		/*WHEN LOADED, INIT AND START THE GAME*/
		init();
		run();
	});
	
	/*CALL FUNCTION*/
	img.src = "img/spritesheet.png";
};

function init(){
	/*INIT VARIABLES*/
	spriteFrame = 0;
	levelSpeed = 60;
	frameCount  = 0;
	direction = 1;
	lives = 3;
	for (i = 1; i < playerCount; i++){
		lives += 2;
	};
	score = 0;
	WLStatus = 0;
	playerHit = 0;
	
	/*INIT PLAYER*/
	player1 = {
		sprite: playerSprite,
		x: (game.width - playerSprite.w) / 2,
		y: game.height - (10 + playerSprite.h)
	};	
	if (playerCount > 1){	
		/*OVERRIDE PLAYER1*/
		player1 = {
			sprite: playerSprite1,
			x: (game.width - playerSprite.w) / 2,
			y: game.height - (10 + playerSprite.h)
		};	
	
		/*INIT PLAYER2*/
		player2 = {
			sprite: playerSprite2,
			x: (game.width - playerSprite.w) / 2,
			y: game.height - (10 + playerSprite.h)
		};
		if (playerCount > 2){	
			/*INIT PLAYER3*/
			player3 = {
				sprite: playerSprite3,
				x: (game.width - playerSprite.w) / 2,
				y: game.height - (10 + playerSprite.h)
			};
			if (playerCount > 3){
				/*INIT PLAYER4*/
				player4 = {
					sprite: playerSprite4,
					x: (game.width - playerSprite.w) / 2,
					y: game.height - (10 + playerSprite.h)
				};
			};
		};
	};
		
	/*INIT SOUNDS*/
	shootSound = new Audio("sound/shoot.wav");
	shootSound.volume = volume;
	explosionSound = new Audio("sound/explosion.wav");
	explosionSound.volume = volume;
	playerHitSound = new Audio("sound/playerHit.wav");
	playerHitSound.volume = volume + 0.2;
	pauseSound = new Audio("sound/pause.wav");
	pauseSound.volume = volume + 0.2;
	backgroundSound = new Audio("sound/bg.mp3");
	backgroundSound.volume = volume + 0.1;
	
		
	/*MUSIC*/
	backgroundSound.play();
	
	/*INIT BULLETS*/
	bullets = [];
	
	/*CREATE SHELTER TYPE*/
	shelter = {
		y: player1.y - (50 + shelterSprite.h),
		h: shelterSprite.h,

		init: function(){
			/*DRAW INTO CANVAS*/
			this.canvas = document.createElement("canvas");
			this.ctx = this.canvas.getContext("2d");
			
			this.canvas.width = game.width;
			this.canvas.height = this.h;
			for (var i = 0; i < 4; i++) {
				this.ctx.drawImage(shelterSprite.img, shelterSprite.x, shelterSprite.y, shelterSprite.w, shelterSprite.h,
					               shelterSprite.w + 10 + 170 * i, 0, shelterSprite.w, shelterSprite.h);
			};
		},
	};
	/*INIT SHELTER*/
	shelter.init();
	
	/*CREATE ENEMIES*/
	aliens = [];
	var rows = [2, 1, 1, 0, 0];
	alienCount = 50;
	len = rows.length;
	
	/*FILL ARRAY*/
	for (var i = 0; i < len; i++){
		for (var j = 0; j < 10; j++){
			var a = rows[i];
			aliens.push({
				sprite: enemySprite[a],
				x: 10 + j * 40,
				y: 10 + i * 40,
				w: enemySprite[a][0].w,
				h: enemySprite[a][0].h
			});
		}
	}
};

/*WAIT FOR AN AMOUNT OF TIME*/
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

/*RESET IF WAVE GOT DESTROYED*/
function resetWave(){
	/*CLEANUP VARIABLES*/
	spriteFrame = 0;
	direction = 1;
	WLStatus = 0;

	/*INCREMENT SCORE*/
	score += 10000;
	
	/*CLEANUP BULLETS*/
	bullets = [];
	
	/*CREATE ENEMIES*/
	aliens = [];
	var rows = [2, 1, 1, 0, 0];
	alienCount = 50;
	len = rows.length;
	
	/*FILL ARRAY*/
	for (var i = 0; i < len; i++){
		for (var j = 0; j < 10; j++){
			var a = rows[i];
			aliens.push({
				sprite: enemySprite[a],
				x: 10 + j * 40,
				y: 10 + i * 40,
				w: enemySprite[a][0].w,
				h: enemySprite[a][0].h
			});
		}
	}
};

/*INFINITE LOOP*/
function run(){
	var loop = function(){
		gameUpdate();
		render();
		
		/*(CONTROLLER ONLY) WAIT FOR BUTTON RELEASE*/
		if(p1shoot==1 && noOfGamepads > 0 && gamepad1.connected &&gamepad1.buttons[2].value< 0.5){
			p1shoot=0;
		}
		if(p2shoot==1 && noOfGamepads > 1 && gamepad2.connected &&gamepad2.buttons[2].value< 0.5){
			p2shoot=0;
		}
		
		if (WLStatus == 0 || WLStatus == 1){
			if (alienCount == 0){
				resetWave();
			}
			window.requestAnimationFrame(loop, game.canvas);
		} 
	};
	window.requestAnimationFrame(loop, game.canvas);
};

function gameUpdate(){
	
	/*PLAYER MOVEMENT*/
	if (input.isDown(LEFT[0]) || (noOfGamepads > 0 && gamepad1.connected && gamepad1.axes[0] < -0.1)){
		if (WLStatus == 0){
			player1.x -= 8;
		}
	};
	if (input.isDown(RIGHT[0]) || (noOfGamepads > 0 && gamepad1.connected && gamepad1.axes[0] > 0.1)){
		if (WLStatus == 0){
			player1.x += 8;
		}
	};
	
	if (input.isPressed(FIRE[0]) || (noOfGamepads > 0 && gamepad1.connected && gamepad1.buttons[2].value>0.5)){
		if (WLStatus == 0){	
			if (p1shoot == 0){
				if (playerCount == 1){
					bullets.push(new Bullet(player1.x + 14, player1.y, -8, 2, 6, "white"));
				} else {
					bullets.push(new Bullet(player1.x + 14, player1.y, -8, 2, 6, "blue"));
				}
				if (shootSound.currentTime > 0){
					shootSound.pause();
					shootSound.currentTime = 0;
				};
				shootSound.play();
				if(noOfGamepads > 0 && gamepad1.connected && (gamepad1.buttons[6].value<0.5||gamepad1.buttons[7].value<0.5))
				{
					p1shoot = 1;
				}
			}
		} 
	};	
	
	/*PLAYER 2 MOVEMENT*/
	if (playerCount > 1){
		if (input.isDown(LEFT[1]) || (noOfGamepads > 1 && gamepad2.connected && gamepad2.axes[0] < -0.1)){
			if (WLStatus == 0){
				player2.x -= 8;
			}
		};
		if (input.isDown(RIGHT[1]) || (noOfGamepads > 1 && gamepad2.connected && gamepad2.axes[0] > 0.1)){
			if (WLStatus == 0){
				player2.x += 8;
			}
		};
		
		if (input.isPressed(FIRE[1]) || (noOfGamepads > 1 && gamepad2.connected && gamepad2.buttons[2].value>0.5)){
			if (WLStatus == 0){	
				if (p2shoot == 0){
					bullets.push(new Bullet(player2.x + 14, player2.y, -8, 2, 6, "red"));
					if (shootSound.currentTime > 0){
						shootSound.pause();
						shootSound.currentTime = 0;
					};
					shootSound.play();
					if(noOfGamepads > 1 && gamepad2.connected && (gamepad2.buttons[6].value<0.5||gamepad2.buttons[7].value<0.5))
					{
						p2shoot = 1;
					}
				}
			}
		};	
		if (playerCount > 2){
			if (input.isDown(LEFT[2])){
				if (WLStatus == 0){
					player3.x -= 8;
				} else {
					WLStatus = 0;
				}
			};
			if (input.isDown(RIGHT[2])){
				if (WLStatus == 0){
					player3.x += 8;
				} else {
					WLStatus = 0;
				}
			};
			
			if (input.isPressed(FIRE[2])){
				if (WLStatus == 0){	
					bullets.push(new Bullet(player3.x + 14, player3.y, -8, 2, 6, "green"));
					if (shootSound.currentTime > 0){
						shootSound.pause();
						shootSound.currentTime = 0;
					};
					shootSound.play();
				} else {
					WLStatus = 0;
				}
			};
			if (playerCount > 3){
				if (input.isDown(LEFT[3])){
					if (WLStatus == 0){
						player4.x -= 8;
					} else {
						WLStatus = 0;
					}
				};
				if (input.isDown(RIGHT[3])){
					if (WLStatus == 0){
						player4.x += 8;
					} else {
						WLStatus = 0;
					}
				};
				
				if (input.isPressed(FIRE[3])){
					if (WLStatus == 0){	
						bullets.push(new Bullet(player4.x + 14, player4.y, -8, 2, 6, "pink"));
						if (shootSound.currentTime > 0){
							shootSound.pause();
							shootSound.currentTime = 0;
						};
						shootSound.play();
					} else {
						WLStatus = 0;
					}
				};				
			}
		};
	};
	
	if (input.isPressed(PAUSE)){
		if (WLStatus == 0){
			WLStatus = 1;
			if (pauseSound.currentTime > 0){
				pauseSound.pause();
				pauseSound.currentTime = 0;
			};
			pauseSound.play();
		}
		else
		{
			WLStatus = 0;
		}
	};
	
	if (WLStatus == 0){
		frameCount++;
		
		player1.x = Math.max(Math.min(player1.x, game.width - (10 + playerSprite.w)), 10);
		if (playerCount > 1){
			player2.x = Math.max(Math.min(player2.x, game.width - (10 + playerSprite.w)), 10);
			if (playerCount > 2){
				player3.x = Math.max(Math.min(player3.x, game.width - (10 + playerSprite.w)), 10);
				if (playerCount > 3){
					player4.x = Math.max(Math.min(player4.x, game.width - (10 + playerSprite.w)), 10);
				}
			}
		};
		
		/*ENEMY MOVEMENT*/
		if (frameCount % levelSpeed == 0){
			/*UPDATE ANIMATION-FRAME*/
			spriteFrame = (spriteFrame + 1) % 2;
			
			/*UPDATE POSITION*/
			var maxX = 0; 
			var minX = game.width;		
			for (var i = 0, len = aliens.length; i < len; i++) {
				var a = aliens[i];
				a.x += 32 * direction;
				
				/*FIND HOW FAR ENEMIES CAN GO*/
				maxX = Math.max(maxX, a.x + a.w);
				minX = Math.min(minX, a.x);
			}
			
			var maxY = 0;
			var minY = game.height;
			for (var i = 0, len = aliens.length; i < len; i++) {
				var a = aliens[i];
		
				/*FIND HOW FAR ENEMIES CAN GO DOWN*/
				maxY = Math.max(maxY, a.y);
				minY = Math.min(minY, a.y);
			}
			
			/*CHECK IF ENEMIES SHOULD GO DOWN*/
			if (maxX > game.width - 10 || minX < 10) {
				/*LET ENEMIES GO DOWN AND INTO THE OTHER DIRECTION*/
				direction = direction * (-1);
				if (levelSpeed > 6){
					levelSpeed -= 2;
				};
				for (var i = 0, len = aliens.length; i < len; i++) {
					aliens[i].x += 32 * direction;
					aliens[i].y += 32;
				}
			}
			
			if (maxY > 480){
				WLStatus = -1;
			}
		}
		
		/*RANDOM SHOOT FROM ALIENS*/
		if (Math.random() < (0.05 * (difficulty + 1)) && aliens.length > 0){
			var a = aliens[Math.round(Math.random() * (aliens.length - 1))];
			
			/*ONLY SHOOT FROM FRONTLINE*/
			for (var i = 0, len = aliens.length; i < len; i++) {
				var b = aliens[i];
				if (Intersect(a.x, a.y, a.w, 100, b.x, b.y, b.w, b.h)) {
					a = b;
				}
			}
			/*CREATE BULLET*/
			bullets.push(new Bullet(a.x + a.w * 0.5, a.y + a.h + 17, 4, 2, 4, "white"));
		}

		/*BULLET CHECKER AND UPDATER*/
		len = bullets.length;
		for (var i = 0; i < len; i++) {
			var b = bullets[i];
			b.update();
			
			/*DELETE BULLETS WHICH ARE OUTSIDE OF THE CANVAS*/
			if (b.y + b.height < 0 || b.y > game.height) {
				bullets.splice(i, 1);
				i--;
				len--;
				continue;
			}
			
			/*CHECK IF BULLETS HIT THE SHELTER*/
			if ((b.y <= shelter.y + 18) && ((b.x >= 54 && b.x <= 98) || (b.x >= 224 && b.x <= 268) || (b.x >= 394 && b.x <= 439) || (b.x >= 564 && b.x <= 608))) {
				bullets.splice(i, 1);
				i--;
				len--;
				continue;
			}
			
			/*CHECK IF BULLETS HIT THE PLAYER*/
			if ((b.y >= player1.y && b.x >= player1.x && b.x <= player1.x + 28)){
				lives--;
				bullets.splice(i, 1);
				i--;
				len--;
				playerHit = 1;
				
				if (playerHitSound.currentTime > 0){
					playerHitSound.pause();
					playerHitSound.currentTime = 0;
				};
				playerHitSound.play();
				
				if (lives == 0){
					WLStatus = -1;
				} 
				continue;
			}
			
			/*CHECK IF BULLETS HIT PLAYER 2*/
			if (playerCount > 1){
				if ((b.y >= player2.y && b.x >= player2.x && b.x <= player2.x + 28)){
					lives--;
					bullets.splice(i, 1);
					i--;
					len--;
					playerHit = 2;
					
					if (playerHitSound.currentTime > 0){
						playerHitSound.pause();
						playerHitSound.currentTime = 0;
					};
					playerHitSound.play();
					
					if (lives == 0){
						WLStatus = -1;
					} 
					continue;
				}
				if (playerCount > 2){
					if ((b.y >= player3.y && b.x >= player3.x && b.x <= player3.x + 28)){
						lives--;
						bullets.splice(i, 1);
						i--;
						len--;
						playerHit = 3;
						
						if (playerHitSound.currentTime > 0){
							playerHitSound.pause();
							playerHitSound.currentTime = 0;
						};
						playerHitSound.play();
						
						if (lives == 0){
							WLStatus = -1;
						} 
						continue;
					}
					if (playerCount > 3){
						if ((b.y >= player4.y && b.x >= player4.x && b.x <= player4.x + 28)){
							lives--;
							bullets.splice(i, 1);
							i--;
							len--;
							playerHit = 4;
							
							if (playerHitSound.currentTime > 0){
								playerHitSound.pause();
								playerHitSound.currentTime = 0;
							};
							playerHitSound.play();
							
							if (lives == 0){
								WLStatus = -1;
							} 
							continue;
						}
						
					};
				};			
			};
			
			/*CHECK IF BULLETS HIT THE ENEMIES*/
			for (var j = 0; j < alienCount; j++){
				var a = aliens[j];
				if (Intersect(b.x, b.y, b.width, b.height, a.x, a.y, a.w, a.h)) {
					aliens.splice(j, 1);
					alienCount--;
					score += 100 * (difficulty + 1);
					j--;
					bullets.splice(i, 1);
					i--;
					len--;
					if (explosionSound.currentTime > 0){
						explosionSound.pause();
						explosionSound.currentTime = 0;
					};
					explosionSound.play();
				}
			}
		}
	}
};

function render() {
	/*CLEAR CANVAS*/
	game.clear();
	
	if (WLStatus == -1){
		/*SHOW GAME OVER*/
		backgroundSound.pause();
		game.ctx.font = "30px Arial";
		game.ctx.fillStyle = "white";
		game.ctx.textAlign = "center";
		game.ctx.fillText("Game Over", game.width / 2, (game.height + 50) / 2 - 25);
		game.ctx.fillText("Score: " + score.toLocaleString(), game.width / 2, (game.height + 50) / 2 + 25);
		
		document.getElementById("score").style.display = 'none';
		document.getElementById("lives").style.display = 'none';
		document.getElementById("line").style.display = 'none';
		document.getElementById('buttonHide').style.display = 'block';
		
		
	} else if (WLStatus == 1){
		/*SHOW PAUSE*/
		game.ctx.font = "30px Arial";
		game.ctx.fillStyle = "white";
		game.ctx.textAlign = "center";
		game.ctx.fillText("Pause", game.width / 2, game.height / 2);
	} else {	
		/*UPDATE SCORE AND LIVES*/
		document.getElementById("score").textContent = "Score: " + score.toLocaleString();
		document.getElementById("lives").textContent = "Lives: " + lives;
	
		/*DRAW ALIENS*/
		for (var i = 0, len = aliens.length; i < len; i++) {
			var a = aliens[i];
			game.drawSprite(a.sprite[spriteFrame], a.x, a.y);
		}
		
		/*SAVE*/
		game.ctx.save();
		
		/*DRAW BULLETS*/
		for (var i = 0, len = bullets.length; i < len; i++) {
			game.drawBullet(bullets[i]);
		}
		
		/*RESTORE AND DRAW PLAYER/SHELTER*/
		game.ctx.restore();
		game.ctx.drawImage(shelter.canvas, 0, shelter.y);
		
			game.drawSprite(player1.sprite, player1.x, player1.y);
			if (playerCount > 1){
				game.drawSprite(player2.sprite, player2.x, player2.y);
				if (playerCount > 2){
					game.drawSprite(player3.sprite, player3.x, player3.y);
					if (playerCount > 3){
						game.drawSprite(player4.sprite, player4.x, player4.y);
					};
				};
			};
	};
};
