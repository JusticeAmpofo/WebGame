// Get reference to the body element
var body = document.getElementById('myBody');

// Get reference to the div elements
var div = document.getElementById('myDiv');
var div2 = document.getElementById('mySecondDiv');

// Get reference to restart and play buttons
var restart = document.getElementById('myRestartButton');
var engage = document.getElementById('myPlayButton');

// Get reference to canvas
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

// Size canvas to fill screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// This is for the high score text in the game over function
var h = canvas.height / 2 + 100 + 'px';

//player
var player = {
	// Keep track of player's position
	posX: canvas.width / 2,
	posY: canvas.height / 2,
	rad: 50, // Player's radius
	faceCol: 'blue',
};

// Goal
var goal = {
	posX: Math.round(Math.random() * canvas.width),
	posY: Math.round(Math.random() * canvas.height),
	rad: 70,
	lineThick: 5,
};

// Color array
var myColorArray = ['grey', 'red', 'orange', 'brown', 'purple'];

var colRand = 0;

function setRandom() {
	goal.posX = Math.round(Math.random() * canvas.width);
	goal.posY = Math.round(Math.random() * canvas.height);
}

// This function determines which color to pick next
function setColor() {
	colRand++;
	if (colRand == myColorArray.length) {
		colRand = 0;
	}
	body.style.background = myColorArray[colRand];
}

// Draws the player but bigger in the game over function
function drawStationPlayer(x, y) {
	context.beginPath();
	context.fillStyle = 'blue';
	context.beginPath();
	context.arc(x, y, 80, 0, Math.PI * 2);
	context.fill();

	// Draw player's left eye
	context.beginPath();
	context.arc(x - 25, y - 30, 20, 0, Math.PI * 2);
	context.fillStyle = 'white';
	context.fill();

	// Draw player's right eye
	context.beginPath();
	context.arc(x + 25, y - 30, 20, 0, Math.PI * 2);
	context.fillStyle = 'white';
	context.fill();

	// Draw player's mouth
	context.beginPath();
	context.arc(x, y + 15, 40, 0, Math.PI);
	context.fillStyle = 'white';
	context.fill();
}

// Write high score
function writeHighScore() {
	context.fillText(
		'High Score: ' + highScore,
		canvas.width / 2,
		canvas.height / 2 + 50
	);
}

// Game variables
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

// The game begins
function startGame() {
	counter = 60;
	score = 0;
	player.faceCol = 'blue';

	// Listen for device orientation event
	window.ondeviceorientation = function (eventData) {
		// Move the player
		player.posX = player.posX + eventData.gamma;
		player.posY = player.posY + eventData.beta;

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

		// Draw player's right eye
		context.beginPath();
		context.arc(player.posX + 15, player.posY - 15, 10, 0, Math.PI * 2);
		context.fillStyle = 'white';
		context.fill();

		// Draw player's mouth
		context.beginPath();
		context.arc(player.posX, player.posY + 10, 20, 0, Math.PI);
		context.fillStyle = 'white';
		context.fill();

		// Font
		context.font = '40px Verdana';
		// Horizontal text alignment
		context.textAlign = 'center';

		// Vertical text alignment, default is "alphabetic"
		context.textBaseline = 'middle';
		// Writing text
		context.fillStyle = 'white';
		context.fillText('Score: ' + score, 100, 25);
		context.fillText('Time: ' + counter, 300, 25);
		context.fillText('High Score: ' + highScore, 650, 25);
	}; // ondeviceorientation ends here
} // StartGame ends

// Starts when the app lanches
function MainMenu() {
	reset();
	context.fillText(
		'Rotate your device to collect the coins!!',
		canvas.width / 2,
		canvas.height / 2
	);
	writeHighScore();
	context.fill();

	drawStationPlayer(canvas.width / 2, canvas.height / 2 - 125);
	div2.style.display = 'block';
	div2.style.top = h;
} // MainMenu function ends here

// When time runs out
function gameOver() {
	reset();
	alert('Time is up!!!');
	context.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2);
	writeHighScore();
	context.fill();

	drawStationPlayer(canvas.width / 2, canvas.height / 2 - 125);
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
} // GameOver function ends here

// When the user is not on a mobile or tablet
function notOnMobileOrTablet() {
	reset();
	context.fillText(
		'Please use this application on a phone or tablet.',
		canvas.width / 2,
		canvas.height / 2
	);
	context.fill();

	drawStationPlayer(canvas.width / 2, canvas.height / 2 - 150);
}

// If the user rejects the request for access to motion and orientation or if another error occurs
function requestRejected(message) {
	reset();
	context.fillText(message, canvas.width / 2, canvas.height / 2);
}

function reset() {
	window.ondeviceorientation = null;
	clearInterval(timer);
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.beginPath();
	context.textBaseline = 'middle';
	context.textAlign = 'center';
	context.font = '40px Verdana';
	context.fillStyle = 'white';
}

function mobileAndTabletCheck() {
	let check = false;
	(function (a) {
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
				a
			) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
				a.substr(0, 4)
			)
		)
			check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
}

function motionRequestion() {
	if (typeof DeviceMotionEvent.requestPermission === 'function') {
		// Handle iOS 13+ devices.
		DeviceMotionEvent.requestPermission()
			.then((state) => {
				if (state === 'granted') {
					startGame();
					countDown();
				} else {
					console.error('Request to access the orientation was rejected');
					requestRejected('Request to access the orientation was rejected');
				}
			})
			.catch((error) => {
				console.error(error);
				requestRejected('Sorry… Something went wrong');
			});
	} else {
		// Handle regular non iOS 13+ devices.
		startGame();
		countDown();
	}
}

// Restart button pressed
restart.onclick = function () {
	div.style.display = 'none';
	startGame();
	countDown();
};

// Start game button pressed
engage.onclick = function () {
	div2.style.display = 'none';
	motionRequestion();
};

if (!mobileAndTabletCheck()) {
	notOnMobileOrTablet();
} else {
	MainMenu();
}
