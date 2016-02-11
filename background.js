function Background(){
	/*METAINFO*/
	this.fps = 60;
	this.canvas = null;
	this.width = 0;
	this.height = 0;
	
	/*SPEED*/
	this.minVelocity = 0;
	this.maxVelocity = 20;
	
	/*MAX STARS*/
	this.stars = 500;
	this.intervalId = 0;
};

/*CLASS STAR*/
function Star(x, y, size, velocity) {
	this.x = x;
	this.y = y; 
	this.size = size;
	this.velocity = velocity;
};

/*INIT*/
Background.prototype.initialise = function(div) {
	/*NO CONFLICTS WITH CANVAS*/
	var bg = this;

	/*SAVE DIV*/
	this.containerDiv = div;
	bg.width = window.innerWidth;
	bg.height = window.innerHeight;

	/*EVENTHANDLER RESIZE*/
	window.onresize = function(event) {
		bg.width = window.innerWidth;
		bg.height = window.innerHeight;
		bg.canvas.width = bg.width;
		bg.canvas.height = bg.height;
		bg.draw();
 	};

	/*CREATE CANVAS*/
	var canvas = document.createElement('canvas');
	div.appendChild(canvas);
	this.canvas = canvas;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
};

/*STAR GENERATOR*/
Background.prototype.start = function() {

	/*FILL ARRAY*/
	var stars = [];
	for(var i = 0; i < this.stars; i++) {
		stars[i] = new Star(Math.random() * this.width, 
		                    Math.random() * this.height, 
							Math.random() * 4,
						   (Math.random() * (this.maxVelocity - this.minVelocity)) + 1);
	};
	
	this.stars = stars;
	var str = this;
	
	/*SET INTERVAL*/
	this.intervalId = setInterval(function() {
		str.update();
		str.draw();	
	}, 1000 / this.fps);
};

Background.prototype.stop = function() {
	clearInterval(this.intervalId);
};

/*UPDATE*/
Background.prototype.update = function() {
	/*TIME FOR 1 FRAME*/
	var time = 1 / this.fps;

	/*MOVE*/
	for(var i = 0; i < this.stars.length; i++) {
		var star = this.stars[i];
		star.y += time * star.velocity;
		
		/*RESET*/
		if(star.y > this.height) {
			this.stars[i] = new Star(Math.random() * this.width, 
			                         0,
									 Math.random() * 4, 
									(Math.random() * (this.maxVelocity - this.minVelocity)) + 1);
		};
	};
};

/*DRAW*/
Background.prototype.draw = function() {

	/*CANVAS = LEINWAND - EVERYTHING IS 2D*/
	var cnvs = this.canvas.getContext('2d');

	/*BACKGROUND*/
 	cnvs.fillStyle = '#000000';
	cnvs.fillRect(0, 0, this.width, this.height);

	/*STARS*/
	cnvs.fillStyle = '#666666';
	for(var i = 0; i < this.stars.length; i++) {
		var star = this.stars[i];
		cnvs.fillRect(star.x, star.y, star.size, star.size);
	};
};
