'use strict';

class Map {
  constructor(rowImages = [], rows, cols, tileWidth, tileHeight, actionRows, actionSpot = tileWidth * actionRows) {
    this.rowImages = rowImages;

    this.rows = rows;
    this.cols = cols;

    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    this.actionRows = actionRows; // The places where the player and enemies can interact
    this.actionSpot = actionSpot; // the default location for the action to start from
  }
}

const map = (function () {
  // The input for the Map class constructor is inside of an IIFE
  // to avoid polluting the global namespace
  const rowImages = [
    'images/water-block.png', // Top rows are water
    'images/water-block.png', //
    'images/stone-block.png', // Row 1 of 4 is stone
    'images/stone-block.png', // Row 2 of 4 is stone
    'images/stone-block.png', // Row 3 of 4 is stone
    'images/stone-block.png', // Row 4 of 4 is stone
    'images/grass-block.png', // Bottom row is grass
  ];

  const actionRows = 4; // the number of stone-block rows in rowImages

  const rows = 7;
  const cols = 9;

  const tileWidth = 101;
  const tileHeight = 83;
  // because there is a partial vertical overlay of the tiles, the height is less than the width
  // even though the actual png file width and height are the same
  const actionSpot = tileWidth * actionRows;

  return new Map(rowImages, rows, cols, tileWidth, tileHeight, actionRows, actionSpot);
})();
