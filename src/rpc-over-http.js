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

  handleSuccess: (req, res, next) => {
    res.json({ jsonrpc: '2.0', result: res.locals.result, error: null, id: res.locals.id });
    return next();
  },

  handleError: (error, req, res, next) => {
    res.json({ jsonrpc: '2.0', result: null, error, id: res.locals.id });
    return next();
  }

}