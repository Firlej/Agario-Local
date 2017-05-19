var blob;
var blobStartSize=10;
var maxDiff=70;
var maxSpeed = 5;

var foods = [];
var foodsAmount = 700;

var bots = [];
var botsStartSize=10;
var botsAmount = 10;
var botsMaxSpeed = 4.5;

var blobScale = 5;
var borderWidth = 10;
var b;

var fps=0, showfps=0;
function setValues() {
	b = {
		left: 0-width*2,
		right: width+width*2,
		up: 0-height*2,
		down: height+height*2 }

	blob = new blobClass();
	blob.pos.x = width/2;
	blob.pos.y = height/2;
	blob.r = blobStartSize;	
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	//createCanvas(400, 400);

	//frameRate(59);

	setValues();

	background(31);

	for(var i=0; i<botsAmount; i++) {
		bots[i] = new botClass();
		bots[i].id = i;
	}
	for(var i=0; i<foodsAmount*1.5; i++) { foods.push(new foodClass()); }
}
function draw() {
	background(31);
	while (foods.length<foodsAmount) { foods.push(new foodClass()); }

	drawFps();

	translate(width/2, height/2);
	blob.zoom = lerp(blob.zoom, blobStartSize/blob.r, 0.05);
	//scale(sqrt(blob.zoom));
	scale(0.2);
	translate(-blob.pos.x, -blob.pos.y);

	drawBorders();

	stroke(0, 100, 0);
	strokeWeight(4);
	fill(120, 20, 20);

	for(var i=0; i<bots.length; i++) {
		bots[i].show();
		bots[i].botUpdate();
	}

	fill(20, 120, 20);
	blob.show();
	blob.update();

	for(var i=0; i<foods.length; i++) {	noStroke(); fill(255); foods[i].show(); }

	checkForFoodEating(blob);

	for(var i=0; i<bots.length; i++) {
		checkForFoodEating(bots[i]);		
	}
}
function blobClass() {
	this.pos = createVector(random(b.left, b.right), random(b.up, b.down));
	this.r = floor(random(1, 3));
	this.noiseVal=0;
	this.zoom = 1;

	this.update = function() {
		var mousePos = createVector(mouseX-width/2, mouseY-height/2);
		var d = dist(width/2, height/2, mousePos.x, mousePos.y);
		if(d>maxDiff) { d=maxDiff; }
		var vel = map(d, 0, maxDiff, 0, maxSpeed);
		mousePos.setMag(vel);
		this.pos.add(mousePos);

		if(this.pos.x>b.right) { this.pos.x = b.right; }
		if(this.pos.x<b.left) { this.pos.x = b.left; }
		if(this.pos.y>b.down) { this.pos.y = b.down;}
		if(this.pos.y<b.up) { this.pos.y = b.up; }
	}
	this.show = function() {
		ellipse(this.pos.x, this.pos.y, this.r*2*blobScale, this.r*2*blobScale);
	}
}
function botClass() {
	this.pos = createVector(random(b.left, b.right), random(b.up, b.down));
	this.r = botsStartSize;
	this.id;
	
	this.dir = createVector(0, 0);

	this.botUpdate = function() {
		if (frameCount%bots.length == this.id) {
			var d = p5.Vector.dist(this.pos, foods[0].pos);
			var chosenI = 0;
			for(var i=1; i<foods.length; i++) {
				var tempD = p5.Vector.dist(this.pos, foods[i].pos);
				if(tempD<d) { d=tempD; chosenI=i; }
			}

			if(d>maxDiff) { d=maxDiff; }
			var vel = map(d, 0, maxDiff, 3, botsMaxSpeed);
			this.dir.x = foods[chosenI].pos.x;
			this.dir.y = foods[chosenI].pos.y;
			this.dir.sub(this.pos);
			this.dir.setMag(vel);
		}
		this.pos.add(this.dir);
	}

	this.show = function() {
		ellipse(this.pos.x, this.pos.y, this.r*2*blobScale, this.r*2*blobScale);
	}
}
function foodClass() {
	this.pos = createVector(random(b.left, b.right), random(b.up, b.down));
	this.r = floor(random(1, 3));

	this.show = function() {
		ellipse(this.pos.x, this.pos.y, this.r*2*blobScale, this.r*2*blobScale);
	}
}
function checkForFoodEating(ball) {
	if(ball.id == undefined) {
		for(var i=foods.length-1; i>=0; i--) {
			var d = p5.Vector.dist(ball.pos, foods[i].pos);
			if (d<ball.r*blobScale) {
				var area = ball.r*ball.r*PI + foods[i].r*foods[i].r*PI;
				var newR = sqrt(area/PI);
				ball.r = newR;

				foods.splice(i, 1);
				return;
			}
		}
	}
	else {
		/* for(var i=foods.length-1; i>=0; i--) {
			if 	(ball.targetFood.pos.x == foods[i].pos.x &&
				 ball.targetFood.pos.y == foods[i].pos.y) {
				var targetI = i;
				break;
			}
		} */

		for(var i=foods.length-1; i>=0; i--) {
			var d = p5.Vector.dist(ball.pos, foods[i].pos);
			if (d<ball.r*blobScale) {
				var area = ball.r*ball.r*PI + foods[i].r*foods[i].r*PI;
				var newR = sqrt(area/PI);
				ball.r = newR;

				foods.splice(i, 1);
				return;
			}
		}
	}
}

function drawBorders() {
	fill(255, 0, 150);
	noStroke();
	rect(b.left-borderWidth, b.up-borderWidth, b.right-b.left+2*borderWidth, borderWidth);
	rect(b.left-borderWidth, b.up-borderWidth, borderWidth, b.down-b.up+2*borderWidth);
	rect(b.right, b.up-borderWidth, borderWidth, b.down-b.up+2*borderWidth);
	rect(b.left-borderWidth, b.down, b.right-b.left+2*borderWidth, borderWidth);
}
function drawFps() {
	fill(0, 102, 153);
	textSize(32);
	fps += getFrameRate();
	if (frameCount%4 == 0 ) { showfps=floor(fps/4); fps=0; }
	text(showfps, 10, 40);
}