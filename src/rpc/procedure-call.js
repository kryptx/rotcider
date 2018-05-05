'use strict';

const Joi = require('joi');

const schema = Joi.object().keys({
  state: Joi.object().default({}),
  method: Joi.object().keys({
    handle: Joi.func().arity(3),
    schema: Joi.object().schema(),
  }).options({ allowUnknown: true }),
  params: Joi.array().required(),
  id: Joi.number(),
});

class ProcedureCall {
  constructor(options) {
    let result = Joi.validate(options, schema);
    if(result.error) {
      throw result.error;
    }

    this.method = result.value.method;
    this.params = result.value.params;
    this.id = result.value.id;
  }

  async execute(deps, state) {
    return this.method.handle(this.params, deps, state);
  }
}

module.exports = ProcedureCall;
