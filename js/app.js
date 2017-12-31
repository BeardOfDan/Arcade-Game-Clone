'use strict';

class Enemy {
  constructor() {
    this.x = -map.tileWidth;
    this.y = (Math.floor(Math.random() * map.actionRows) * map.tileHeight) + map.tileHeight;

    this.topSpeed = 350;
    this.playerKills = 0;

    this.speed = Math.floor((Math.random() * this.topSpeed) + 1);
    this.sprite = 'images/enemy-bug.png';
  }

  update(dt) {
    this.x += this.speed * dt;
    //  Δx += dist/time  * Δtime

    // detect collision with player
    if ((Math.abs(this.x - player.x) < 70) && (Math.abs(this.y - player.y) < 15)) {
      // there is a collision
      player.respawn();
      this.playerKills++;
    }

    // if the enemy is off the screen
    if (this.x > ctx.canvas.width) { // put enemy at respawn point
      this.x = -map.tileWidth;
      // put enemy on a random new row
      this.y = (Math.floor(Math.random() * map.actionRows) * map.tileHeight) + map.tileHeight;
    }
  };

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
} // end of class Enemy

class Player {
  constructor() {
    this.sprite = 'images/char-boy.png';
    this.y = this.x = map.actionSpot;

    this.score = 0;
    this.lives = 3;

    this.bestScore = 0;

    /* TODO: give Player speed (like Enemy has) for a transition
     instead of just appearing on the next tile */
  }

  backToStart() {
    this.y = map.actionSpot;
  }

  respawn() {
    this.lives--;
    this.backToStart();

    if (this.lives < 1) { // Game Over
      this.lives = 3;

      if (this.score > this.bestScore) { // new High Score
        this.bestScore = this.score;
      }

      this.score = 0;
    }
  }

  victoryLap() {
    this.score++;
    this.backToStart();

    // increase the challenge
    // the enemies get a bit faster
    for (let i = 0; i < allEnemies.length; i++) {
      allEnemies[i].speed += 15;
    }

    if ((this.score % 3) === 0) {
      // every 3 points gets the player a new life
      this.lives++;
      // and a new enemy
      allEnemies.push(new Enemy());
    }
  }

  // Parameter: dt, a time delta between ticks
  update(dt) {
    if (this.y < 0) {
      this.victoryLap();
    }

    /* TODO: add variables for the player's destination
             have the handleInput function change those instead of the actual position
             put a while loop here to move the player to his destination until he reaches it
             This will give the effect of him moving
    */
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    ctx.font = '26px Arial';
    ctx.fillStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#fff';

    if (this.score > this.bestScore) {
      ctx.strokeStyle = 'gold';
    }

    const scoreText = 'Score: ' + this.score;
    const scoreLocation = [405, 50];

    ctx.fillText(scoreText, ...scoreLocation);
    ctx.strokeText(scoreText, ...scoreLocation);

    if (this.bestScore > this.score) {
      ctx.strokeStyle = 'gold';
    } else {
      ctx.strokeStyle = '#fff';
    }

    const highScoreText = 'High Score: ' + this.bestScore;
    const highScoreLocation = [606, 50];

    ctx.fillText(highScoreText, ...highScoreLocation);
    ctx.strokeText(highScoreText, ...highScoreLocation);

    if (this.lives < 3) {
      ctx.strokeStyle = '#f00';
    } else if (this.lives > 3) {
      ctx.strokeStyle = '#0f0';
    } else {
      ctx.strokeStyle = '#fff';
    }

    const livesText = 'Lives: ' + this.lives;
    const livesLocation = [205, 50];

    ctx.fillText(livesText, ...livesLocation);
    ctx.strokeText(livesText, ...livesLocation);
  } // end of Player.render()

  handleInput(eventKey) {
    switch (eventKey) {
      case 'ArrowUp':
      case 'w':
        this.y -= map.tileHeight;
        // this.victoryLap() will prevent the player from going too far up
        break;
      case 'ArrowDown':
      case 's':
        if (this.y < map.actionSpot) {
          this.y += map.tileHeight;
        }
        break;
      case 'ArrowLeft':
      case 'a':
        if (this.x > 0) {
          this.x -= map.tileWidth;
        }
        break;
      case 'ArrowRight':
      case 'd':
        if (this.x < ((map.rows + 1) * map.tileWidth)) {
          this.x += map.tileWidth;
        }
        break;
      default: // the user pressed some other key
        console.log(eventKey);
    }
  } // end of handleInput function
} // end of class Player

const allEnemies = [];

// Initialize the board with 6 enemies
for (let i = 0; i < 6; i++) {
  allEnemies.push(new Enemy());
}

// create the player
var player = new Player();

// listen for user input
document.addEventListener('keyup', function (e) {
  player.handleInput(e.key);
});
