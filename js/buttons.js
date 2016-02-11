/*SETS DIFFICULTY HARDER*/
function harder(){
	diffFont = ["Easy", "Medium", "Hard"];
	if (difficulty < 2){
		difficulty++;
	}
	document.getElementById("difficulty").textContent = diffFont[difficulty];
};

/*SETS DIFFICULTY EASIER*/
function easier(){
	diffFont = ["Easy", "Medium", "Hard"];
	if (difficulty > 0){
		difficulty--;
	}
	document.getElementById("difficulty").textContent = diffFont[difficulty];
};

/*SHOW CREDITS*/
function credits(){
	document.getElementById('creditsScreen').style.display = 'block';
};

/*HIDE CREDITS*/
function creditsHide(){
	document.getElementById('creditsScreen').style.display = 'none';
};

/*SHOW CONTROL*/
function control(){
	document.getElementById('controlScreen').style.display = 'block';
};

/*HIDE CONTROL*/
function controlHide(){
	document.getElementById('controlScreen').style.display = 'none';
};

/*CALLS 1 PLAYER GAME*/	
function game1player(){
	playerCount = 1;
	document.getElementById("score").style.display = 'block';
	document.getElementById("lives").style.display = 'block';
	document.getElementById("line").style.display = 'block';
	document.getElementById('menuHide').style.display = 'none';
	main();
}

/*CALLS 2 PLAYER GAME*/	
function game2player(){
	playerCount = 2;
	document.getElementById("score").style.display = 'block';
	document.getElementById("lives").style.display = 'block';
	document.getElementById("line").style.display = 'block';
	document.getElementById('menuHide').style.display = 'none';
	main();
}

/*CALLS 3 PLAYER GAME*/	
function game3player(){
	playerCount = 3;
	document.getElementById("score").style.display = 'block';
	document.getElementById("lives").style.display = 'block';
	document.getElementById("line").style.display = 'block';
	document.getElementById('menuHide').style.display = 'none';
	main();
}

/*CALLS 4 PLAYER GAME*/	
function game4player(){
	playerCount = 4;
	document.getElementById("score").style.display = 'block';
	document.getElementById("lives").style.display = 'block';
	document.getElementById("line").style.display = 'block';
	document.getElementById('menuHide').style.display = 'none';
	main();
}

/*SHOWS REPLAY BUTTON*/
function replay(){
	game.clear();
	document.getElementById('buttonHide').style.display = 'none';
	backgroundSound.pause();
	if (playerCount == 1){
		game1player();
	} else if (playerCount == 2){
		game2player();
	} else if (playerCount == 3){
		game3player();
	} else if (playerCount == 4){
		game4player();
	};
}

/*SHOS MAINMENU*/
function goToMain(){
	game.clear();
	document.getElementById("score").style.display = 'none';
	document.getElementById("lives").style.display = 'none';
	document.getElementById("line").style.display = 'none';
	document.getElementById('menuHide').style.display = 'block';	
};
