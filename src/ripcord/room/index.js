'use strict';

let directions = [ 'n', 's', 'e', 'w', 'u', 'd' ];

let move = ([ x, y, z ], direction) => {

  const ops = {
    n: () => z++,
    e: () => x++,
    s: () => z--,
    w: () => x--,
    u: () => y++,
    d: () => y--
  };

  ops[direction]();

  return [ x, y, z ];
};

let opposite = direction => {
  const results = {
    n: 's',
    s: 'n',
    e: 'w',
    w: 'e',
    u: 'd',
    d: 'u',
  };
  return results[direction];
};

module.exports = class Room {
  constructor(opts) {
    this.location = opts.location || [ 0, 0, 0 ];
    this.stage = opts.stage || 0;
    this.exits = Object.assign({}, opts.exits);
    this.description = opts.description || 'It is a room. It seems to have four walls.';
    this.items = opts.items || [];
  }

  addConnection(direction, room) {
    room.location = move(this.location, direction);
    this.exits[direction] = room;
    room.exits[opposite(direction)] = this;
    return room;
  }

  addRandomConnection(rooms) {
    let candidates = directions.filter(d => !this.exits[d]);
    if(candidates.length) {
      let direction = candidates[Math.floor(Math.random() * candidates.length)];
      let newLocation = move(this.location, direction);
      let targetRoom = rooms.filter(r => r.location === newLocation);
      if(targetRoom && targetRoom.stage === this.stage) {
        this.exits[direction] = targetRoom;
        targetRoom.exits[opposite(direction)] = this;
        return targetRoom;
      }
      return this.addConnection(direction, new Room({ stage: this.stage }));
    }

    // try again from a random room of this stage
    let stageRooms = rooms.filter(r => r.stage === this.stage);
    let originRoom = stageRooms[Math.floor(Math.random() * stageRooms.length)];
    return originRoom.addRandomConnection(rooms);
  }

  // ideally, a room with a locked door
  // (at first, probably just the 'end' room)
  // will provide an alternative implementation
  mayExit(direction) {
    return !!this.exits[direction];
  }
};