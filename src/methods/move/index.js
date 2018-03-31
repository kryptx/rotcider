'use strict';

const Joi = require('joi');

let normalize = input => {
  return input.toLowerCase()
    .substr(0, 1)
    .replace('f', 'n')
    .replace('r', 'e')
    .replace('b', 's')
    .replace('l', 'w');
};

let move = (character, direction) => {
  let [ x, y, z ] = character.location;

  const ops = {
    n: () => z++,
    e: () => x++,
    s: () => z--,
    w: () => x--,
    u: () => y++,
    d: () => y--
  };

  ops[direction]();

  return character.location = [ x, y, z ];
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
  requirements: [ 'character' ],
  handle: async (args, deps, state) => {
    const world = state.world;
    const character = state.character;
    let [ x, y, z ] = character.location;
    const room = world && world[x][y][z];

    if(!room) return {
      message: 'You seem to be floating in the nether. Has no one created a world for you?',
    };

    const direction = normalize(args.direction);
    if(room.mayExit(direction)) {
      [ x, y, z ] = move(state.character, direction);
      return {
        message: 'Moved successfully.',
        location: [ x, y, z ],
        room: state.world[x][y][z]
      };
    } else {
      return {
        message: 'It doesn\'t look like you can go that way.',
        location: character.location
      };
    }
  }
};
