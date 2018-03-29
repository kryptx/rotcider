'use strict';

const Joi = require('joi');

exports = module.exports = {
  schema: Joi.any().optional(),
  handle: async () => 'pong'
};