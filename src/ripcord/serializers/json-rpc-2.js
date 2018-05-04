'use strict';

const Joi = require('joi');
const schema = Joi.object().keys({
  jsonrpc: Joi.string().only('2.0').required().strip(),
  method: Joi.string().required(),
  params: Joi.any(),
  id: Joi.alternatives().try(Joi.number(), Joi.string()).allow(null).default(null)
});

exports = module.exports = {
  serialize: thing => {
    let envelop = result => {
      let response = { jsonrpc: '2.0', id: result.id };

      if(result instanceof Error) {
        response.error = result;
        response.result = null;
      } else if (result.id) {
        response.result = result;
        response.error = null;
      } else {
        // fine, whatever, I didn't want to respond anyway
        return null;
      }
    };

    return Array.isArray(thing) ?
      thing.map(envelop).filter(i => i !== null) :
      envelop(thing);
  },
  /**
   * A Serializer's deserialize method should return options for a ProcedureCall.
   */
  deserialize: str => {
    let message = JSON.parse(str);
    let result = Joi.validate(message, [ schema , Joi.array().items(schema) ]);
    if(result.error) throw result.error;
    return result.value;
  }
};