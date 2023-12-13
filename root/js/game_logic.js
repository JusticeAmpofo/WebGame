if (window.orientation == undefined) {
	alert('This game is meant for smartphones and tablets');
}

//Get reference to the body element
var body = document.getElementById('myBody');

//Get reference to the div elements
var div = document.getElementById('myDiv');
var div2 = document.getElementById('mySecondDiv');

//Get reference to restart and play buttons
var restart = document.getElementById('myRestartButton');
var engage = document.getElementById('myPlayButton');

// Get reference to canvas
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

// Size canvas to fill screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//This for the high score text in the game over function
var h = canvas.height / 2 + 100 + 'px';

//player
var player = {
	// Keep track of player's position
	posX: canvas.width / 2,
	posY: canvas.height / 2,
	rad: 50, //player's radius
	faceCol: 'blue',
};

//goal
var goal = {
	posX: Math.round(Math.random() * canvas.width),
	posY: Math.round(Math.random() * canvas.height),
	rad: 70,
	lineThick: 5,
};

//Color array
var myColorArray = ['grey', 'red', 'orange', 'brown', 'purple'];

var colRand = 0;

function setRandom() {
	goal.posX = Math.round(Math.random() * canvas.width);
	goal.posY = Math.round(Math.random() * canvas.height);
}

//This function determines which color to pick next
function setColor() {
	colRand++;
	if (colRand == myColorArray.length) {
		colRand = 0;
	}
	body.style.background = myColorArray[colRand];
}

//draws the player but bigger in the game over function
function drawStationPlayer(x, y) {
	context.beginPath();
	context.fillStyle = 'blue';
	context.beginPath();
	context.arc(x, y, 80, 0, Math.PI * 2);
	context.fill();

	//Draw player's left eye
	context.beginPath();
	context.arc(x - 25, y - 30, 20, 0, Math.PI * 2);
	context.fillStyle = 'white';
	context.fill();

	//Draw player's right eye
	context.beginPath();
	context.arc(x + 25, y - 30, 20, 0, Math.PI * 2);
	context.fillStyle = 'white';
	context.fill();

	//Draw player's mouth
	context.beginPath();
	context.arc(x, y + 15, 40, 0, Math.PI);
	context.fillStyle = 'white';
	context.fill();
}

//game variables
var score = 0;
var counter;
var timer;
var highScore;

function countDown() {
	timer = setInterval(function () {
		if (counter == 0) {
			gameOver();
		} else {
			counter--;
		}
	}, 1000);
}

// Local Storage for the high score.
if (typeof Storage != 'undefined') {
	if (localStorage.getItem('currentHighScore') === null) {
		highScore = 0;
	} else {
		highScore = localStorage.getItem('currentHighScore');
	}
} else {
	alert("Your browswer won't save the High Score :( ");
}

//The game begins
function startGame() {
	counter = 60;
	score = 0;
	player.faceCol = 'blue';

	// Listen for device orientation event
	window.ondeviceorientation = function (eventData) {
		// Move the player
		player.posX = player.posX + event.gamma;
		player.posY = player.posY + event.beta;

		//the Distance between player and goal
		var dx = goal.posX - player.posX;
		var dy = goal.posY - player.posY;
		var distance = Math.sqrt(dx * dx + dy * dy);

		// Keep Player in bounds
		if (player.posX < 0) player.posX = 0;
		if (player.posX > canvas.width) player.posX = canvas.width;
		if (player.posY < 0) player.posY = 0;
		if (player.posY > canvas.height) player.posY = canvas.height;

		//collision
		if (distance < player.rad + goal.rad) {
			score++;
			setRandom();
			if (score > highScore) {
				player.faceCol = 'green';
				highScore++;
			}

			if (score % 5 == 0) {
				setColor();
			}
		}

		// Clear scene
		context.clearRect(0, 0, canvas.width, canvas.height);

		//Draw goal
		context.beginPath();
		context.arc(goal.posX, goal.posY, goal.rad, 0, Math.PI * 2);
		context.fillStyle = 'yellow';
		context.lineWidth = goal.lineThick;
		context.fill();

		// Draw player
		context.beginPath();
		context.arc(player.posX, player.posY, player.rad, 0, Math.PI * 2);
		context.fillStyle = player.faceCol;
		context.fill();

		//Draw player's left eye
		context.beginPath();
		context.arc(player.posX - 15, player.posY - 15, 10, 0, Math.PI * 2);
		context.fillStyle = 'white';
		context.fill();

		//Draw player's right eye
		context.beginPath();
		context.arc(player.posX + 15, player.posY - 15, 10, 0, Math.PI * 2);
		context.fillStyle = 'white';
		context.fill();

		//Draw player's mouth
		context.beginPath();
		context.arc(player.posX, player.posY + 10, 20, 0, Math.PI);
		context.fillStyle = 'white';
		context.fill();

		//font
		context.font = '40px Verdana';
		// Horizontal text alignment
		context.textAlign = 'center';

		// Vertical text alignment, default is "alphabetic"
		context.textBaseline = 'middle';
		//writing text
		context.fillStyle = 'white';
		context.fillText('Score: ' + score, 100, 25);
		context.fillText('Time: ' + counter, 300, 25);
		context.fillText('High Score: ' + highScore, 650, 25);
	}; //ondeviceorientation ends here
} //startGame ends

//Starts when the app lanches
function MainMenu() {
	window.ondeviceorientation = null;
	clearInterval(timer);
	context.clearRect(0, 0, canvas.width, canvas.height);

	context.beginPath();
	context.textBaseline = 'middle';
	context.textAlign = 'center';
	context.font = '40px Verdana';
	context.fillStyle = 'white';
	context.fillText(
		'Rotate your device to collect the coins!!',
		canvas.width / 2,
		canvas.height / 2
	);
	context.fillText(
		'High Score: ' + highScore,
		canvas.width / 2,
		canvas.height / 2 + 50
	);
	context.fill();

	drawStationPlayer(canvas.width / 2, canvas.height / 2 - 100);
	div2.style.display = 'block';
	div2.style.top = h;
} //MainMenu function ends here

//When time runs out
function gameOver() {
	window.ondeviceorientation = null;
	clearInterval(timer);
	context.clearRect(0, 0, canvas.width, canvas.height);
	alert('Time is up!!!');
	context.beginPath();
	context.textBaseline = 'middle';
	context.textAlign = 'center';
	context.font = '40px Verdana';
	context.fillStyle = 'white';
	context.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2);
	context.fillText(
		'High Score: ' + highScore,
		canvas.width / 2,
		canvas.height / 2 + 50
	);
	context.fill();

	drawStationPlayer(canvas.width / 2, canvas.height / 2 - 100);
	div.style.display = 'block';
	div.style.top = h;

	if (player.faceCol == 'green') {
		if (typeof Storage != 'undefined') {
			alert('New High Score!');
			localStorage.setItem('currentHighScore', highScore);
		}
		context.fillText(
			'New High Score!',
			canvas.width / 2,
			canvas.height / 2 - 250
		);
	}
} //GameOver function ends here

//restart button pressed
restart.onclick = function () {
	div.style.display = 'none';
	startGame();
	//countdown timer
	countDown();
};

//start game button pressed
engage.onclick = function () {
	div2.style.display = 'none';
	startGame();
	countDown();
};

MainMenu();
