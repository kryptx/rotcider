'use strict';

const Joi = require('joi');

exports = module.exports = {
  schema: Joi.object().keys({
    force: Joi.boolean().optional()
  }).optional(),
  handle: async (args, { PlayerCharacter, World }, state) => {
    if(state.character && (!args || !args.force))
      return { message: 'You already have a character. To start over, pass the parameter force: true.' };

    state.character = new PlayerCharacter();
    state.world = new World();

    return {
      message: 'Welcome to the RPC over HTTP adventure. A character and a world have been created and sent to you as cookies. The decoded contents of the character cookie are included in this response, and you can view it anytime with the "reflect" method. The world cookie can only be inspected by playing!',
      character: state.character
    };
  }
};