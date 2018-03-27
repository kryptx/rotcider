'use strict';

const Joi = require('joi');

exports = module.exports = {
  schema: Joi.object().optional(),
  handle: async (args, deps, state) => {
    if(!state.player) {
      return {
        message: "You haven't created a character yet. To create one, use the 'start' method.",
        player: null
      };
    }
    return {
      player: state.player
    };
  }
};