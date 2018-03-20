'use strict';

const Joi = require('joi');

module.exports = {
  schema: {
    direction: Joi.string().valid([
      'north','south','east','west',
      'up','down','left','right',
      'n','s','e','w','u','d','l','r',
      'back','backward','forward'
    ]).required()
  },
  handle: async (args, state) => ({ moved: args.direction })
}

