'use strict';

const Joi = require('joi');

exports = module.exports = {
  schema: Joi.any().optional(),
  requirements: [ 'character' ],
  handle: async (args, deps, state) => {
    return {
      character: state.character
    };
  }
};