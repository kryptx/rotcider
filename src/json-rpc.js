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

exports = module.exports = {
  invoke: async (body, deps, state) => {
    let validated_body = exports.validate(body, deps);
    return await methods[body.method].handle(body.params, deps, state);
  },
  validate: (body, deps) => {
    // state is not provided because we are not validating what the character can do
    // we are validating, the format, syntax, and contents of the request body itself
    const joiError = deps.ErrorFunnel.joi;
    const result = Joi.validate(body, schema, { abortEarly: false });
    if(result.error) throw joiError(result.error);

    // validate params using complete schema, now that we know we have a valid method
    const complete_schema = Object.assign({}, schema, { params: methods[body.method].schema })
    const params_result = Joi.validate(body, complete_schema, { abortEarly: false });
    if(params_result.error) throw joiError(params_result.error);

    return params_result.value;
  },
  handle: deps => async (req, res, next) => {
    let result;
    let state = exports.readState(req);
    try {
      result = await exports.invoke(req.body, deps, state);
    } catch (e) {
      return next(e);
    }
    exports.writeState(res, state);
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
  },
  readState: req => {
    return "some values from an encrypted cookie or local storage";
  },
  writeState: (res, state) => {
    // save state somewhere
    return;
  }
}