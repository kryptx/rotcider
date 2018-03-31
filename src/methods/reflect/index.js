'use strict';

const Joi = require('joi');

exports = module.exports = {
  schema: Joi.any().optional(),
  requirements: [ 'player' ],
  handle: async (args, deps, state) => {
    return {
      player: state.player
    };
  }
};