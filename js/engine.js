'use strict';

var Engine = (function (global) {
  /* Predefine the variables we'll be using within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
   */
  const doc = global.document;
  const win = global.window;
  const canvas = doc.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let lastTime;

  canvas.width = map.cols * map.tileWidth;
  canvas.height = (map.rows - 1) * map.tileWidth;
  doc.body.appendChild(canvas);

  function main() {
    // Store the time between ticks in a variable.
    // This way the game can appear to run at the same speed on any computer.
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0; // The time between ticks, converted to milliseconds

    updateEntities(dt);
    render();

    // The current point will be the next tick's 'last time'
    lastTime = now;

    win.requestAnimationFrame(main);
  }

  /* This function does some initial setup that should only occur once,
   * particularly setting the lastTime variable that is required for the
   * game loop.
   */
  function init() {
    lastTime = Date.now();
    main();
  }

  function updateEntities(dt) {
    for (let i = 0; i < allEnemies.length; i++) {
      allEnemies[i].update(dt);
    }

    player.update(dt);
  }

  function render() {
    // render map
    for (let row = 0; row < map.rows; row++) {
      for (let col = 0; col < map.cols; col++) {
        // The Resources object utilizes caching, since the images are used repeatedly
        ctx.drawImage(Resources.get(map.rowImages[row]), col * map.tileWidth, (row * map.tileHeight) - 50);
      }
    }

    // render characters
    renderEntities();
  }

  function renderEntities() {
    for (let i = 0; i < allEnemies.length; i++) {
      allEnemies[i].render();
    }

    player.render();
  }

  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
   */
  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/enemy-bug.png',
    'images/char-boy.png'
  ]);

  Resources.onReady(init);

  global.ctx = ctx;
})(this);
