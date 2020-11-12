'use strict';

const Joi = require('joi');

module.exports = {
  schema: Joi.object().keys({
    direction: Joi.string().valid(
      'north','south','east','west',
      'up','down','left','right',
      'n','s','e','w','u','d','l','r',
      'back','backward','forward'
    ).insensitive().required()
  }).required(),
  requirements: [ 'character' ],
  handle: async (args, { Directions }, state) => {
    const character = state.character;
    const room = character.room;

    if(!room) return {
      message: 'You seem to be floating in the nether. This is almost certainly a bug.',
    };

    const direction = Directions.normalize(args.direction, character.facing);
    if(room.mayExit(direction)) {
      state.character.room = room.exits[direction];
      return {
        message: 'Moved successfully.',
        room: character.room
      };
    } else {
      return {
        message: 'It doesn\'t look like you can go that way.',
        room: character.room.toJSON()
      };
    }
  }
};
