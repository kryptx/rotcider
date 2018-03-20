'use strict';
// Super Duper JSON-RPC Adapter for express
// See index.js for usage
const Joi = require('joi');
const methods = require('./methods');

const schema = {
  jsonrpc: Joi.string().only('2.0').required(),
  method: Joi.string().only(Object.keys(methods)).required(),
  params: Joi.object(),
  id: Joi.any()
}

module.exports = {
  validate: (req, res, next) => {
    // sanitize request
    const result = Joi.validate(req.body, schema);
    if(result.error) return next(result.error);
    Object.assign(res.locals, result.value);

    // validate params using complete schema, for complete error message
    const complete_schema = {
      jsonrpc: schema.jsonrpc,
      method: schema.method,
      params: methods[res.locals.method].schema,
      id: Joi.any()
    }
    const params_result = Joi.validate(req.body, complete_schema);
    if(params_result.error) return next(params_result.error);
    // all done!
    return next();
  },
  handle: state => async (req, res, next) => {
    const result;
    try {
      result = await methods[res.locals.method].handle(res.locals.params, state);
    } catch (e) { return next(e); }

    res.json({
      jsonrpc: '2.0',
      result,
      error: null,
      id: res.locals.id
    });
  },
  handleError = (error, req, res, next) => {
    res.json({
      jsonrpc: '2.0',
      result: null,
      error,
      id: res.locals.id
    });
  }
}