'use strict';

const Joi = require('joi');

exports = module.exports = {
  schema: Joi.object().optional(),
  handle: async (args, deps, state) => "pong"
};