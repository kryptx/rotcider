'use strict';

const Directions = require('../directions');

module.exports = class Room {
  constructor(opts = {}) {
    let defaults = {
      location: [ 0, 0, 0 ],
      stage: 0,
      exits: {},
      description: 'It is a room. It seems to have four walls.',
      items: [],
      enemies: []
    };
    Object.assign(this, defaults, opts);
  }

  addConnection(direction, room) {
    room.location = Directions.move(this.location, direction);
    this.exits[direction] = room;
    room.exits[Directions.opposite(direction)] = this;
    return room;
  }

  addRandomConnection(rooms) {
    let candidates = Directions.list.filter(d => !this.exits[d]);
    if(candidates.length) {
      let direction = candidates[Math.floor(Math.random() * candidates.length)];
      let newLocation = Directions.move(this.location, direction);
      let targetRoom = rooms.filter(r => r.location === newLocation);
      if(targetRoom && targetRoom.stage === this.stage) {
        this.exits[direction] = targetRoom;
        targetRoom.exits[Directions.opposite(direction)] = this;
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

  static fromJSON(r) {
    return new Room(r);
  }

  toJSON() {
    return {
      location: this.location,
      exits: Object.keys(this.exits),
      description: this.description,
      items: this.items,
      enemies: this.enemies
    };
  }
};