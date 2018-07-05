var snake;
var scl = 20;

var food;
var highscore = 0;

var munch, dead, funky;
function loadSounds() {
    munch = new Audio('sounds/munch.mp3');
    munch.volume = .9;

    dead = new Audio('sounds/dead.mp3');
    dead.volume = .9;

    funky = new Audio('sounds/funky.mp3');
    funky.volume = .05;
    funky.loop = true;
    funky.play();
}

function setup() {
    var canvas = createCanvas(600, 600);
    canvas.parent('holder');

    snake = new Snake();
    frameRate(10);

	//Food object is placed at certain point at beginning of the first game
    food = createVector(400, 260);

    loadSounds();
}

//Finds a random location on game board to place the food object. Will not place it on edges of board
function pickLocation() {
    var cols = floor(width/scl);
    var rows = floor(height/scl);
    food = createVector(floor(random(1,cols-1)), floor(random(1,rows-1)));
    food.mult(scl);
}

function draw() {
    background(51);
    snake.death();
    snake.update();
    snake.show();

	//Will replace food if it is eaten by snake
    if(snake.eat(food)){
        pickLocation();
    }

    fill('#FFAB40');
    rect(food.x, food.y, scl, scl);
}

//Uses keypresses of arrow keys to determine snake movement. Cannot reverse its movement in x/y direction
function keyPressed() {
    if(keyCode === UP_ARROW && snake.xspeed !== 0) {
        snake.dir(0, -1);
    }
    else if(keyCode === DOWN_ARROW && snake.xspeed !== 0){
        snake.dir(0, 1);
    }
    else if(keyCode === RIGHT_ARROW && snake.yspeed !== 0){
        snake.dir(1, 0);
    }
    else if(keyCode === LEFT_ARROW && snake.yspeed !== 0){
        snake.dir(-1, 0);
    }
}

//Snake object. Starts at same point at beginning of each game.
function Snake() {
    this.x = 100;
    this.y = 260;
    this.xspeed = 1;
    this.yspeed = 0;

    this.total = 0;
    this.tail = [];

    this.dir = function(x, y) {
        this.xspeed = x;
        this.yspeed = y;
    }

	//Checks to see if snake collides with tail
	//Tail movement continues even if snake is stuck in wall, so death check still works
	//If there is a collision, reset snake and score
    this.death = function() {
        for(var i = 0; i < this.tail.length; i++){
            var pos = this.tail[i];
            var d = dist(this.x, this.y, pos.x, pos.y);

            if(d < 1){
                dead.play();
                this.total = 0;
                document.querySelector('#score').innerHTML = 0;
                this.tail = [];
                this.x = 100;
                this.y = 260;
                this.xspeed = 1;
                this.yspeed = 0;
            }
        }
    }

	//Tail takes position of previous tail segment's location when moving
	//If a food object is eaten, create a new vector at that food's location
    this.update = function() {
        if(this.total === this.tail.length) {
            for(var i = 0; i < this.tail.length - 1; i++){
                this.tail[i] = this.tail[i+1];
            }
        }
        this.tail[this.total-1] = createVector(this.x, this.y);

		//Every frame, move snake to next tile depending on xspeed/yspeed
        this.x = this.x + this.xspeed*scl;
        this.y = this.y + this.yspeed*scl;

		//Restrict snake's movement within game board
        this.x = constrain(this.x, 0, width-scl);
        this.y = constrain(this.y, 0, height-scl);
    }

    this.show = function() {
        fill('#80D8FF');

        for(var i = 0; i < this.tail.length; i++) {
            rect(this.tail[i].x, this.tail[i].y, scl, scl);
        }
        rect(this.x, this.y, scl, scl);
    }

	//Checks if food object is eaten. If so, increase score.
    this.eat = function(pos) {
        var d = dist(this.x, this.y, pos.x, pos.y);
        if(d < 1){
            munch.play();
            this.total++;
            document.querySelector('#score').innerHTML = (this.total)*100;
            if(highscore < (this.total)*100){
                highscore = (this.total)*100;
                document.querySelector('#highscore').innerHTML = highscore;
            }
            return true;
        }
        else
            return false;

    }
}