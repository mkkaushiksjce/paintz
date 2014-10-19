/**
 * Create a new PacMan instance.
 * @param {HTMLCanvasElement} canvas - The canvas on which Pac-Man is to be drawn.
 * @param {Number} x - The x-coordinate at which Pac-Man should start.
 * @param {Number} y - The y-coordinate at which Pac-Man should start.
 */
function PacMan(canvas, x, y) {
	this._started = false;
	
	this.canvas = canvas;
	this.cxt = canvas.getContext('2d');
	this.x = x || Math.floor(canvas.width * 0.2);
	this.y = y || Math.floor(canvas.height * 0.2);
	this.heading = PacMan.HEADINGS.RIGHT;
	
	this.startSound = document.getElementById('pacManStartSound');
	
	this._mouthSize = 0;
	this._mouthOpening = true;
	
	this.update = this._update.bind(this);
	
	this._initListeners();
}
// Constants.
PacMan.RADIUS = 30;
PacMan.SPEED = 2;
PacMan.MOUTH_SPEED = Math.PI / 16;
PacMan.MAX_MOUTH_SIZE = Math.PI / 4;
PacMan.START_SOUND_LENGTH = 4000; // In milliseconds.
PacMan.HEADINGS = {
	RIGHT: 0,
	DOWN: 0.5 * Math.PI,
	LEFT: Math.PI,
	UP: 1.5 * Math.PI
};
PacMan.KEYS = {
	LEFT: [37, 65], // Left, A
	UP: [38, 44, 87], // Up, comma, W
	RIGHT: [39, 68, 69], // Right, D, E
	DOWN: [40, 79, 83] // Down, O, S
};
	

/**
 * Initialize key event listeners for Pac-Man.
 */
PacMan.prototype._initListeners = function () {
	window.addEventListener('keydown', (function (e) {
		if (PacMan.KEYS.UP.indexOf(e.keyCode) !== -1) {
			e.preventDefault();
			this.heading = PacMan.HEADINGS.UP;
		} else if (PacMan.KEYS.RIGHT.indexOf(e.keyCode) !== -1) {
			e.preventDefault();
			this.heading = PacMan.HEADINGS.RIGHT;
		} else if (PacMan.KEYS.DOWN.indexOf(e.keyCode) !== -1) {
			e.preventDefault();
			this.heading = PacMan.HEADINGS.DOWN;
		} else if (PacMan.KEYS.LEFT.indexOf(e.keyCode) !== -1) {
			e.preventDefault();
			this.heading = PacMan.HEADINGS.LEFT;
		}
	}).bind(this), false);
};

/**
 * Play the starting sound and start Pac-Man after it plays.
 */
PacMan.prototype.start = function () {
	// Do not start this Pac-Man if it has already started.
	if (this._started) {
		return;
	}
	// Draw Pac-Man, but do not start him moving yet.
	this._update();
	// Play the start sound.
	if (this.startSound && this.startSound.play) {
		this.startSound.play();
	}
	// NOW set Pac-Man to have started.
	this._started = true;
	// Start moving after the sound finishes. 
	setTimeout(this.update, PacMan.START_SOUND_LENGTH);
};

PacMan.prototype._update = function () {
	// If this Pac-Man is supposed to be running, loop.
	if (this._started) {
		Utils.raf(this.update);
	}
	
	// �Eat� everything under Pac-Man.
	this.cxt.fillStyle = fillColor;
	this.cxt.beginPath();
	this.cxt.arc(this.x, this.y, PacMan.RADIUS, 0.5 * Math.PI + this.heading, 1.5 * Math.PI + this.heading);
	this.cxt.closePath();
	this.cxt.fill();
	this.cxt.beginPath();
	this.cxt.moveTo(this.x, this.y);
	this.cxt.arc(this.x, this.y, PacMan.RADIUS, this._mouthSize + this.heading, 0.5 * Math.PI + this.heading);
	this.cxt.closePath();
	this.cxt.fill();
	this.cxt.beginPath();
	this.cxt.moveTo(this.x, this.y);
	this.cxt.arc(this.x, this.y, PacMan.RADIUS, 1.5 * Math.PI + this.heading, 2 * Math.PI - this._mouthSize + this.heading);
	this.cxt.closePath();
	this.cxt.fill();
	
	// Move Pac-Man.
	switch (this.heading) {
		case PacMan.HEADINGS.UP:
			this.y -= PacMan.SPEED;
			break;
		case PacMan.HEADINGS.RIGHT:
			this.x += PacMan.SPEED;
			break;
		case PacMan.HEADINGS.DOWN:
			this.y += PacMan.SPEED;
			break;
		case PacMan.HEADINGS.LEFT:
			this.x -= PacMan.SPEED;
			break;
	}
	// Animate Pac-Man's mouth.
	this._mouthSize += PacMan.MOUTH_SPEED * (this._mouthOpening ? 1 : -1);
	if (this._mouthOpening && this._mouthSize > PacMan.MAX_MOUTH_SIZE) {
		this._mouthSize = PacMan.MAX_MOUTH_SIZE;
		this._mouthOpening = false;
	} else if (!this._mouthOpening && this._mouthSize < 0) {
		this._mouthSize = 0;
		this._mouthOpening = true;
	}
		
	// Screen wrap.
	if (this.x < -(PacMan.RADIUS * 2)) {
		this.x = canvas.width + (PacMan.RADIUS * 2);
	} else if (this.x > canvas.width + (PacMan.RADIUS * 2)) {
		this.x = -(PacMan.RADIUS * 2);
	} else if (this.y < -(PacMan.RADIUS * 2)) {
		this.y = canvas.height + (PacMan.RADIUS * 2);
	} else if (this.y > canvas.height + (PacMan.RADIUS * 2)) {
		this.y = -(PacMan.RADIUS * 2);
	}
	
	// Draw Pac-Man.
	this.cxt.fillStyle = 'yellow';
	this.cxt.beginPath();
	this.cxt.arc(this.x, this.y, PacMan.RADIUS - 1, 0.5 * Math.PI + this.heading, 1.5 * Math.PI + this.heading);
	this.cxt.closePath();
	this.cxt.fill();
	this.cxt.beginPath();
	this.cxt.moveTo(this.x, this.y);
	this.cxt.arc(this.x, this.y, PacMan.RADIUS - 1, this._mouthSize + this.heading, 0.5 * Math.PI + this.heading);
	this.cxt.closePath();
	this.cxt.fill();
	this.cxt.beginPath();
	this.cxt.moveTo(this.x, this.y);
	this.cxt.arc(this.x, this.y, PacMan.RADIUS - 1, 1.5 * Math.PI + this.heading, 2 * Math.PI - this._mouthSize + this.heading);
	this.cxt.closePath();
	this.cxt.fill();
};
