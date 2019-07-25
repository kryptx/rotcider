'use strict';

const Room = require('./room');

const intInRange = ([ min, max ]) => Math.ceil(Math.random() * (1 + max - min));

exports = module.exports = class World {
  constructor(empty = false) {
    this.rooms = [];
    if(!empty) {
      this.addRoom(new Room());
    }
  }

  get start() {
    return this.rooms[0];
  }

  roomAt(location) {
    return this.rooms.find(r =>
      r.location[0] == location[0] &&
      r.location[1] == location[1] &&
      r.location[2] == location[2]
    );
  }

  addRoom(room) {
    this.rooms.push(room);
    return room;
  }

  createBranch(tip, length) {
    let actual_length = intInRange(length);
    for(let i = 0; i < actual_length; i++) {
      this.rooms.push(tip = tip.addRandomConnection(this.rooms));
    }
    return tip;
  }

  async build(stages, items, enemies) {
    // maze: {
    //   branch_count: [ 1, 2 ],  // number of branches other than the main. [ min, max ]. 5 is a lot. Can be 0.
    //   branch_length: [ 3, 5 ], // number of rooms per branch. [ min, max ]. Kinda up to you.
    //   branch_times: 3          // number of times to repeat this madness
    // },

    let current = this.start;
    let sIndex = 0;

    let stage = stages[sIndex];
    for(let i = 0; i < stage.maze.branch_times; i ++) {
      let branches = 1 + intInRange(stage.maze.branch_count);
      let lastTip;
      for(let j = 0; j < branches; j++) {
        lastTip = this.createBranch(current, stage.maze.branch_length, sIndex);
      }
      current = lastTip;
    }

    current.stage = 1;

    // stage_enemies: [ 0, 0, 0, 0, 0, 1 ]
    // stage_loot: [ 0, 1, 2, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ],
    this._populate({
      items: { loadIndexes: stage.stage_loot, fromArray: items },
      enemies: { loadIndexes: stage.stage_enemies, fromArray: enemies }
    });
  }

  _populate({ ...args }) {
    let keys = Object.keys(args);
    for(let key of keys) {
      for(let index of args[key].loadIndexes) {
        let roomIndex = Math.floor(Math.random() * this.rooms.length);
        this.rooms[roomIndex][key].push(Object.assign({}, args[key].fromArray[index]));
      }
    }
  }

  toJSON() {
    return this.rooms.map(r => {
      let room = {
        stage: r.stage,
        location: r.location,
        description: r.description,
        items: r.items,
        exits: {}
      };
      for(let dir of Object.keys(r.exits)) {
        room.exits[dir] = this.rooms.indexOf(r.exits[dir]);
      }
      return room;
    });
  }

  _populateRaw(raw_rooms) {
    this.rooms = raw_rooms.map(r => Room.fromJSON(r));
    for(let r of this.rooms) {
      for(let dir of Object.keys(r.exits)) {
        r.exits[dir] = this.rooms[r.exits[dir]];
      }
    }
  }

  static fromJSON(raw_rooms) {
    let world = new World(true);
    world._populateRaw(raw_rooms);
    return world;
  }
};
