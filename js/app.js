var Enemy = function () {
  "use strict";

  this.sprite = 'images/enemy-bug.png';

  this.x = -101;
  this.y = 0;

  this.topSpeed = 350;
  // hardcoding the top possible speed

  // determine which row this enemy is in
  this.y = (Math.floor(Math.random() * 4) * 83) + 83;

  // determine speed of this particular enemy
  this.speed = Math.floor(Math.random() * this.topSpeed + 1);

  this.playerKills = 0;
  /* TODO: change sprite when this value is incremented */
};

// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += this.speed * dt;
  // dist/time * Δtime = Δdist

  // detect collision with player
  if ((Math.abs(this.x - player.x) < 70) && (Math.abs(this.y - player.y) < 15)) {
    // there is a collision
    player.respawn();
    this.playerKills++;
  }

  // if the enemy is off the screen
  if (this.x > ctx.canvas.width) {
    this.x = -101; // put enemy at respawn point
    // put enemy on a random new row
    this.y = (Math.floor(Math.random() * 4) * 83) + 83;
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function () {
  "use strict";

  this.sprite = "images/char-boy.png";
  this.x = 404;
  this.y = 404;

  this.score = 0;
  this.lives = 3;

  this.bestScore = 0;

  /* TODO: give Player speed (like Enemy has) for a transition
   instead of just appearing on the next tile */

}; // end of Player class

Player.prototype.backToStart = function () {
  this.y = 404;
};

Player.prototype.respawn = function () {
  this.lives--;
  this.backToStart();
  if (this.lives < 1) { // Game Over
    this.lives = 3;
    if (this.score > this.bestScore) { // new High Score
      this.bestScore = this.score;
    }
    this.score = 0;
  }
};

Player.prototype.victoryLap = function () {
  this.score++;
  this.backToStart();
  // increase the challenge
  // the enemies get a bit faster
  allEnemies.forEach(function (enemy) {
    enemy.speed += 15;
  });
  if (this.score % 3 === 0) {
    // every 3 points gets the player a new life
    this.lives++;
    // and a new enemy
    allEnemies.push(new Enemy());
  }
  // update score on screen
};

// Parameter: dt, a time delta between ticks
Player.prototype.update = function (dt) {
  if (this.y < 0) {
    this.victoryLap();
  }

  /* TODO: add variables for the player's destination
           have the handleInput function change those instead of the actual position
           put a while loop here to move the player to his destination until he reaches it
           This will give the effect of him moving
  */
};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

  ctx.font = "26px Arial";
  ctx.fillStyle = "#000";
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#fff";

  if (this.score > this.bestScore) {
    ctx.strokeStyle = "gold";
  }

  ctx.fillText("Score: " + this.score, 405, 50);
  ctx.strokeText("Score: " + this.score, 405, 50);

  if (this.bestScore > this.score) {
    ctx.strokeStyle = "gold";
  } else {
    ctx.strokeStyle = "#fff";
  }

  ctx.fillText("High Score: " + this.bestScore, 605, 50);
  ctx.strokeText("High Score: " + this.bestScore, 605, 50);

  if (this.lives < 3) {
    ctx.strokeStyle = "#f00";
  } else if (this.lives > 3) {
    ctx.strokeStyle = "#0f0";
  } else {
    ctx.strokeStyle = "#fff";
  }
  ctx.fillText("Lives: " + this.lives, 205, 50);
  ctx.strokeText("Lives: " + this.lives, 205, 50);
}; // end of Player.render()

Player.prototype.handleInput = function (eventKey) {
  var nonGameKey = false;
  switch (eventKey) {
    case "up":
    case "w":
      this.y -= 83;
      // this.victoryLap() will prevent the
      // player from going too far up
      break;
    case "down":
    case "s":
      if (this.y < 404) {
        this.y += 83;
      }
      break;
    case "left":
    case "a":
      if (this.x > 0) {
        this.x -= 101;
      }
      break;
    case "right":
    case "d":
      if (this.x < 808) {
        this.x += 101;
      }
      break;
    default:
      // the user pressed some other key
      nonGameKey = true;
  }

  if (!nonGameKey) {
    //console.log("X: " + this.x + "  ||  Y: " + this.y);
  }
}; // end of handleInput function

var allEnemies = [
  new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy()
];

var player = new Player();

document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    87: "w",
    65: "a",
    83: "s",
    68: "d"
  };
  player.handleInput(allowedKeys[e.keyCode]);
});
