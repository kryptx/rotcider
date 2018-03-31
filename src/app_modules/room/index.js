'use strict';

module.exports = class Room {
  constructor(opts) {
    this.exits = Object.assign({
      n: null, s: null,
      e: null, w: null,
      u: null, d: null
    }, opts.exits);
    this.description = opts.description || 'It is a room. It seems to have four walls.';
    this.items = opts.items || [];
  }

  addExit(direction, room) {
    this.exits[direction] = room;
  }

  // ideally, a room with a locked door
  // (at first, probably just the 'end' room)
  // will provide an alternative implementation
  mayExit(direction) {
    return !!this.exits[direction];
  }
};