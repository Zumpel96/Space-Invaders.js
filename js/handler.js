function Intersect(ax, ay, aw, ah, bx, by, bw, bh) {
	return ax < bx+bw && bx < ax+aw && ay < by+bh && by < ay+ah;
};

/*SPRITE OBJECT*/
function Sprite(img, x, y, w, h) {
	this.img = img;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
};

/*DRAW SPRITE FUNCTION*/
Game.prototype.drawSprite = function(sp, x, y) {
	this.ctx.drawImage(sp.img, sp.x, sp.y, sp.w, sp.h, x, y, sp.w, sp.h);
};

/*BULLET CLASS*/
function Bullet(x, y, vely, w, h, color) {
	this.x = x;
	this.y = y;
	this.vely = vely;
	this.width = w;
	this.height = h;
	this.color = color;
};

/*UPDATE FUNCTION*/
Bullet.prototype.update = function() {
	this.y += this.vely;
};

/*DRAW A BULLET*/
Game.prototype.drawBullet = function(bullet) {
	// set the current fillstyle and draw bullet
	this.ctx.fillStyle = bullet.color;
	this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
};

/*GAME CLASS*/
function Game() {
	var w = window;
	this.canvas = document.createElement("canvas");
	this.ctx = this.canvas.getContext("2d");
	this.canvas.width = this.width = 660;
	this.canvas.height = this.height = 600;
	this.canvas.style.position = "absolute";
	this.canvas.style.left = ((w.innerWidth / 2) - 330) + "px";
	this.canvas.style.top = (((w.innerHeight * 0.75) - (w.innerHeight * 0.11)) - 385) + "px";
	this.canvas.style.zIndex = 2;
	
	/*ATTACH TO HTML*/
	document.body.appendChild(this.canvas);
};

/*CLEAR*/
Game.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
};

/*INPUT HANDLER*/
function InputHandler() {
	this.down = {};
	this.pressed = {};
	var me = this;
	document.addEventListener("keydown", function(evt) {
		me.down[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete me.down[evt.keyCode];
		delete me.pressed[evt.keyCode];
	});
};

/*RETURN KEYCODE*/
InputHandler.prototype.isDown = function(code) {
	return this.down[code];
};

/*RETURN IF KEY GOT PRESSED*/
InputHandler.prototype.isPressed = function(code) {
	if (this.pressed[code]) {
		return false;
	} else if (this.down[code]) {
		return this.pressed[code] = true;
	}
	return false;
};

/*CHECK IF GAMEPAD IS CONNECTED*/
window.addEventListener("gamepadconnected", function(e){
	if(e.gamepad.index==0){
		gamepad1=e.gamepad;
		noOfGamepads++;
		document.getElementById('gp1').setAttribute("style","opacity: 1");	
	} else {
		gamepad2=e.gamepad;
		noOfGamepads++;
		document.getElementById('gp2').setAttribute("style","opacity: 1");
	}	
});
	
/*CHECK IF GAMEPAD GOT DISCONNECTED*/
window.addEventListener("gamepaddisconnected", function(e){
	if(e.gamepad.index==0){
		gamepad1=e.gamepad;
		if (navigator.appVersion.indexOf("Chrome/") == -1) {	
			document.getElementById('gp1').setAttribute("style","opacity: 0.1");
		}
	} else {
		gamepad2=e.gamepad;
		if (navigator.appVersion.indexOf("Chrome/") == -1) {
			document.getElementById('gp2').setAttribute("style","opacity: 0.1");
		}
	}	
});

/*CHECK IF BUTTON GOT PRESSED*/
function buttonPressed(b){
		if (typeof(b) == "object"){
			return b.pressed;
		}
		return b = 1.0;
}
