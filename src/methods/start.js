'use strict';

const Joi = require('joi');

exports = module.exports = {
  schema: Joi.object().keys({
    force: Joi.boolean().optional()
  }).optional(),
  handle: async (args, { PlayerCharacter, World }, state) => {
    if(state.player && (!args || !args.force)) return {
      message: 'You already have a player. To destroy it and create a new one, pass force: true'
    };

    state.player = new PlayerCharacter();
    state.world = new World();
    return {
      message: 'Welcome to the rpc adventure. A character and a world have been created and sent to you as cookies. The decoded contents of the player cookie are included in this response. The world cookie can only be inspected by playing!',
      player: state.player
    }
  }
};