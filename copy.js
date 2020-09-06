let canvas;
let ctx;

canvas = document.getElementById("canvas")
ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 800;
document.body.appendChild(canvas);

//creating the doodle
let gravity = 0.1;
let ySpeed = 3;
let xSpeed = 0;
let heroX = canvas.width / 2;
let heroY = canvas.height / 2;
let heroSize = 60
let yDistanceTravelled = 0;

let score = 0;


let bgReady, heroReady, monsterReady;
let bgImage, heroImage;


let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;
// Setup + load image
function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Graph-paper.svg/1024px-Graph-paper.svg.png";
  // show the hero image
  heroImage = new Image();
  heroImage.onload = function () {
    heroReady = true;
  };
  heroImage.src = "https://raw.githubusercontent.com/JasonMize/coding-league-assets/master/doodle-jump-doodler.png";

  for (let i = 0; i < 200; i++) {
    var pf = new Platform(Math.floor(Math.random() * 500), platformY);
    platforms.push(pf);
    platformY -= 50;
  }

}

// create player and doodle

// create Platform 
var platforms =[]
var platformY = 800;

function reset(){

}



function showScore() {
  if (yDistanceTravelled > score) {
      score = Math.round(yDistanceTravelled);
  }
  document.getElementById("total-score").innerHTML = `${score}`;
}


class Platform {
  constructor(x, y) {
      this.x = x;
      this.y = y;
      this.w = 80;
      this.h = 10;
      this.ySpeed = 3;
      this.wasAbove = false;
      this.visible = true;
      this.hasSpring = false;
      this.chance = Math.floor(Math.random() * 10);
      this.springX = this.x+Math.floor(Math.random() * 75);
  }
  show() {
      if (this.chance === 2) {
          this.hasSpring = true;
      }
      if (this.visible) {
          ctx.fillStyle = 'green';
          ctx.fillRect(this.x, this.y, this.w, this.h);
          if (this.hasSpring) {
              ctx.fillStyle = 'gray';
              ctx.fillRect(this.springX, this.y-10, 15, 10);
          }
      }
  }
  update() {
      if (this.y > 950) {
          this.visible = false;
      }
      if (heroY < this.y-60) {
          this.wasAbove = true;
      }
      this.y -= ySpeed*0.01;
      ySpeed += gravity;
      if (heroX < this.x + this.w && heroX + heroSize > this.x && heroY < this.y + this.h && heroY + heroSize > this.y && this.wasAbove && this.visible) {
          ySpeed = -800;
      }
      if (this.hasSpring) {
          if (heroX < this.springX + 10 && heroX + heroSize > this.springX && heroY < this.y-10 + 10 && heroY + heroSize > this.y-10 && this.wasAbove && this.visible) {
              ySpeed = -1500;
          }
      }
  }
}



/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */


/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}
/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  
  if (37 in keysDown) { // Player is holding left key
    heroX -= 10;
  }
  if (39 in keysDown) { // Player is holding right key
    heroX += 10;
  }
  yDistanceTravelled -= ySpeed /100;
  heroX += xSpeed;

  if(heroX < -heroSize) {
    heroX = canvas.width
  } else if(heroX > canvas.width) {
    heroX = -heroSize;
  }
  
};


/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0,600,800);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY,60,60);
  }
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update(); 
  render();
  //platform
  for (let i = 0; i < platforms.length; i++) {
    platforms[i].show();
    platforms[i].update(); 
  }
  showScore()  
  // Request to do this again ASAP. This is a special method
  // for web browsers. 
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();