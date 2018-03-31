'use strict';

const Joi = require('joi');

/* eslint complexity: 0 */
let normalize = input => {
  switch(input.toLowerCase()) {
  case 'north':
  case 'n':
  case 'forward':
    return 'n';
  case 'south':
  case 's':
  case 'back':
  case 'backward':
    return 's';
  case 'east':
  case 'e':
  case 'right':
  case 'r':
    return 'e';
  case 'west':
  case 'w':
  case 'left':
  case 'l':
    return 'w';
  case 'up':
  case 'u':
    return 'u';
  case 'down':
  case 'd':
    return 'd';
  }
};

let move = (player, direction) => {
  let [ x, y, z ] = player.location;
  switch(direction) {
  case 'n':
    z++;
    break;
  case 'e':
    x++;
    break;
  case 's':
    z--;
    break;
  case 'w':
    x--;
    break;
  case 'u':
    y++;
    break;
  case 'd':
    y--;
    break;
  }
  return player.location = [ x, y, z ];
};

module.exports = {
  schema: Joi.object().keys({
    direction: Joi.string().valid([
      'north','south','east','west',
      'up','down','left','right',
      'n','s','e','w','u','d','l','r',
      'back','backward','forward'
    ]).insensitive().required()
  }).required(),
  // args, deps, state
  handle: async (args, deps, state) => {
    if(!state || !state.player) return {
      message: 'I\'m sorry, who are you again?',
      hint: 'start'
    };

    const world = state.world;
    const player = state.player;
    const room = world[x][y][z];
    let [ x, y, z ] = player.location;

    if(!room) return {
      message: 'You seem to be floating in the nether. Has no one created a world for you?',
    };

    const direction = normalize(args.direction);
    if(state.room.mayExit(direction)) {
      [ x, y, z ] = move(state.player, direction);
      return {
        message: 'Moved successfully.',
        location: [ x, y, z ],
        room: state.world[x][y][z]
      };
    } else {
      return {
        message: 'It doesn\'t look like you can go that way.'
      };
    }
  }
};
