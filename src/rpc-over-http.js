'use strict';

exports = module.exports = {

  readState: ({ StateMarshal }) => async (req, res, next) => {
    res.locals.state = {};
    let keys = Object.keys(req.cookies);
    let values = await Promise.all(keys.map(key => StateMarshal.decode(req.cookies[key])));

    for(let i = 0; i < keys.length; i++)
      res.locals.state[keys[i]] = values[i];

    return next();
  },

  writeState: ({ StateMarshal }) => async (req, res, next) => {
    let keys = Object.keys(res.locals.state);
    let cookies = await Promise.all(keys.map(key => StateMarshal.encode(res.locals.state[key])));

    for(let i = 0; i < keys.length; i++)
      res.cookie(keys[i], cookies[i]);

    return next();
  },

  respond: (req, res, next) => {
    res.status(res.locals.response.error ? 500 : 200).json(res.locals.response);
    return next();
  },

  handleError: (error, req, res, next) => {
    res.json({ jsonrpc: '2.0', result: null, error: { code: -32000, message: 'Unexpected error.', data: error.stack }, id: res.locals.id });
    return next();
  }

}