'use strict';

const Joi = require('joi');

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
}

module.exports = ProcedureCall;
