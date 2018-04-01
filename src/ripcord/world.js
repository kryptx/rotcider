'use strict';

const Room = require('./room');
const rooms = [];

const intInRange = ([ min, max ]) => Math.ceil(Math.random() * (1 + max - min));

exports = module.exports = class World {
  constructor(empty = false) {
    if(!empty) {
      rooms.push(new Room());
    }
  }

  get start() {
    return rooms[0];
  }

  createBranch(tip, length) {
    let actual_length = intInRange(length);
    for(let i = 0; i < actual_length; i++) {
      rooms.push(tip = tip.addRandomConnection(rooms));
    }
    return tip;
  }

  async build(stages) {
    // maze: {
    //   branch_count: [ 1, 2 ],  // number of branches other than the main. [ min, max ]. 5 is a lot. Can be 0.
    //   branch_length: [ 3, 5 ], // number of rooms per branch. [ min, max ]. Kinda up to you.
    //   branch_times: 3          // number of times to repeat this madness
    // },

    let current = this.start;
    let sIndex = 0;
    // for(let sIndex = 0; sIndex < stages.length; sIndex++) {
    let stage = stages[sIndex];
    for(let i = 0; i < stage.maze.branch_times; i ++) {
      let branches = 1 + intInRange(stage.maze.branch_count);
      let lastTip;
      for(let j = 0; j < branches; j++) {
        lastTip = this.createBranch(current, stage.maze.branch_length, sIndex);
      }
      current = lastTip;
    }
    // final_obstacle: {
    //   type: 'door',
    //   key: 4                   // held by the bandit
    // }
    current.stage = 1;
    // }

    // stage_loot: [ 0, 1, 2, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ],
    // stage_enemies: [ 0, 0, 0, 0, 0, 1 ],
  }

  toJSON() {
    return rooms.map(r => {
      let room = {
        stage: r.stage,
        location: r.location,
        description: r.description,
        items: r.items,
        exits: {}
      };
      for(let dir of Object.keys(r.exits)) {
        room.exits[dir] = rooms.indexOf(r.exits[dir]);
      }
      return room;
    });
  }

  populate(raw_rooms) {
    rooms.push(...raw_rooms);
    for(let room of raw_rooms) {
      for(let dir of Object.keys(room.exits)) {
        room.exits[dir] = rooms[room.exits[dir]];
      }
    }
  }

  static fromJSON(raw_rooms) {
    let world = new World(true);
    world.populate(raw_rooms);
    return world;
  }
};
