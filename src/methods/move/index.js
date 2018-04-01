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
    const character = state.character;
    const room = character.room;

    if(!room) return {
      message: 'You seem to be floating in the nether. Has no one created a world for you?',
    };

    const direction = normalize(args.direction);
    if(room.mayExit(direction)) {
      state.character.room = room.exits[direction];
      return {
        message: 'Moved successfully.',
        room: character.room
      };
    } else {
      return {
        message: 'It doesn\'t look like you can go that way.',
        room: character.room
      };
    }
  }
};
