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
  validate: deps => {
    const joiError = deps.ErrorFunnel.joi;
    return (req, res, next) => {
      // sanitize request
      const result = Joi.validate(req.body, schema, { abortEarly: false });
      if(result.error) return next(joiError(result.error));

      Object.assign(res.locals, result.value);

      // validate params using complete schema, now that we know we have a valid method
      const complete_schema = Object.assign({}, schema, { params: methods[res.locals.method].schema })
      const params_result = Joi.validate(req.body, complete_schema, { abortEarly: false });
      if(params_result.error) return next(joiError(params_result.error));
      // all done!
      return next();
    }
  },
  handle: deps => async (req, res, next) => {
    let result;
    try {
      result = await methods[res.locals.method].handle(res.locals.params, deps);
    } catch (e) {
      return next(e);
    }

    res.json({
      jsonrpc: '2.0',
      result,
      error: null,
      id: res.locals.id
    });
  },
  handleError: (error, req, res, next) => {
    res.json({
      jsonrpc: '2.0',
      result: null,
      error,
      id: res.locals.id
    });
  }
}