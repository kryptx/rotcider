'use strict';
// Super Duper JSON-RPC Adapter for express
// See index.js for usage
const Joi = require('joi');
const methods = require('./methods');

const PARSE_ERROR = -32700 // Invalid JSON was received by the server.
const INVALID_REQUEST = -32600; // The JSON sent is not a valid Request object.
const METHOD_NOT_FOUND = -32601; // The method does not exist / is not available.
const INVALID_PARAMS = -32602; // Invalid method parameter(s).
const INTERNAL_ERROR = -32603; // Internal JSON-RPC error.

const schema = Joi.object().keys({
  jsonrpc: Joi.string().only('2.0').required(),
  method: Joi.string().required(),
  params: Joi.any(),
  id: [Joi.number(), Joi.string().allow(null)]
});

exports = module.exports = {
  handle: deps => async (req, res, next) => {
    res.locals.response = await exports.invoke(req.body, deps, res.locals.state);
    return next();
  },

  invoke: async (body, deps, state) => {
    const do_request = async (request) => {
      let result = null, error = null;
      try {
        let safe_body = exports.validate(request, deps);
        let rpc_method = methods[safe_body.method].handle;
        result = await rpc_method(safe_body.params, deps, state);
      }
      catch (e) { error = e; }
      return { jsonrpc: '2.0', result, error, id: request.id }
    }
    return Array.isArray(body) ?
      Promise.all(body.map(await do_request)) : await do_request(body);
  },

  validate: (body, { ErrorFunnel }) => {
    const joiError = ErrorFunnel.joi;
    const result = Joi.validate(body, schema);
    if(result.error) throw joiError(result.error, INVALID_REQUEST);

    // this could be part of the Joi schema,
    // but then it'd be hard to separate METHOD_NOT_FOUND errors
    if(!Object.keys(methods).includes(result.value.method)) {
      throw {
        code: METHOD_NOT_FOUND,
        message: `Method not found: ${result.value.method}`
      }
    }

    const params_result = Joi.validate(body.params, methods[body.method].schema.label('params'), { abortEarly: false });
    if(params_result.error) throw joiError(params_result.error, INVALID_PARAMS);
    return result.value;
  }
}