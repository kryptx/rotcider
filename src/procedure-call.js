'use strict';

const Joi = require('joi');
const Methods = require('./methods');

// when things fail, the outcome will be different **per serializer**
const schema = Joi.object().keys({
  state: Joi.object().default({}),
  method: Joi.string().required().min(1),
  params: Joi.array().required(),
  id: Joi.number(),
});

class ProcedureCall {
  constructor(options) {
    let result = Joi.validate(options, schema);
    if(result.error) {
      throw result.error;
    }

    this.state = result.value.state;
    this.method = result.value.method;
    this.params = result.value.params;
    this.id = result.value.id;
  }

  async execute(deps) {
    return Methods[this.method].handle(this.params, deps, this.state);
  }
}

module.exports = ProcedureCall;
