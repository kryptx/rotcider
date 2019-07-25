'use strict';

const Joi = require('joi');
const Stages = require('../../example-dungeon/stages');
const Enemies = require('../../example-dungeon/enemies');
const Items = require('../../example-dungeon/items');

exports = module.exports = {
  schema: Joi.object().keys({
    force: Joi.boolean().optional()
  }).optional(),
  handle: async (args, { Models }, state) => {
    if(state.character && (!args || !args.force))
      return { message: 'You already have a character. To start over, pass the parameter force: true.' };

    state.world = new Models.world();
    state.world.build(Stages, Items, Enemies);
    state.character = new Models.character({ room: state.world.start });

    return {
      message: 'Welcome to the RPC over HTTP adventure. A character and a world have been created and sent to you as cookies. The decoded contents of the character cookie are included in this response, and you can view it anytime with the "reflect" method. The world cookie can only be inspected by playing!',
      character: state.character.toJSON()
    };
  }
};