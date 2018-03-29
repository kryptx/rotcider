'use strict';

exports = module.exports = class World {
  constructor(dims = { x: 10, y: 2, z: 10 }) {
    this.initializeEmpty(dims);
  }

  initializeEmpty(dims) {
    this.map = [];
    for(let x = 0; x <= dims.x; x++) {
      this.map[x] = [];
      for(let y = 0; y <= dims.y; y++) {
        this.map[x][y] = [].fill(null, 0, dims.z);
      }
    }
  }

  toJSON() {
    return {
      map: this.map
    };
  }
};
