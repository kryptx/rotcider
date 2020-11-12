'use strict';

const Joi = require('joi');
const schema = Joi.object().keys({
  jsonrpc: Joi.string().valid('2.0').required().strip(),
  method: Joi.string().required(),
  params: Joi.any(),
  id: Joi.alternatives().try(Joi.number(), Joi.string()).allow(null).default(null)
});

exports = module.exports = {
  Accept: [ 'application/json-rpc', 'application/json' ],
  ContentType: 'application/json-rpc',
  serialize: thing => {
    let envelop = result => {
      let response = { jsonrpc: '2.0', id: result.id };

      if(result instanceof Error) {
        response.error = {
          code: -32700,
          message: result.message,
          stack: result.stack
        };
        response.result = null;
      } else if (result.id) {
        response.result = result.result;
        response.error = null;
      } else {
        // whatever, I didn't want to respond anyway
        return null;
      }

      return JSON.stringify(response);
    };

    return Array.isArray(thing) ?
      thing.map(envelop).filter(i => i !== null) :
      envelop(thing);
  },

  deserialize: requestBody => {
    let message = JSON.parse(requestBody);
    let result = Joi.validate(message, [ schema , Joi.array().items(schema) ]);
    if(result.error) throw result.error;
    return result.value;
  }
};
