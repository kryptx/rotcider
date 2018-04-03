'use strict';

exports = module.exports = {
  logRequest: ({ Log }) => (req, res, next) => {
    Log.info({
      message: 'request',
      request: req.body,
      response: res.locals.response,
      status: res.statusCode
    });
    next();
  },
  readState: ({ StateMarshal, PlayerCharacter, World }) => async (req, res, next) => {
    res.locals.state = {};
    let keys = Object.keys(req.cookies);
    let values = await Promise.all(keys.map(key => StateMarshal.decode(req.cookies[key])));
    // this is a little leaky (compared to writeState), these methods probably belong in StateMarshal
    // they definitely belong in the app itself and not this adapter
    const types = {
      character: PlayerCharacter,
      world: World
    };

    for(let i = 0; i < keys.length; i++)
      res.locals.state[keys[i]] = types[keys[i]] ?
        types[keys[i]].fromJSON(values[i]) :
        values[i];

    let { world, character } = res.locals.state;
    if(character && world) {
      character.room = world.roomAt(character.room.location);
    }
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
    if(!res.locals.response) {
      res.status(204).end();
    } else {
      // I have seen the JSON-RPC-over-HTTP spec that suggests HTTP codes for each of certain JSON-RPC errors.
      // Since they could create ambiguity, and also because not all transports will support it,
      // I've decided to stick with error/success.
      res.status(res.locals.response.error ? 500 : 200).json(res.locals.response);
    }
    return next();
  },

  handleError: (error, req, res, next) => {
    // most errors won't make it this far. if something outside JSONRPC throws unexpectedly, I still want to send a JSONRPC error
    res.json({ jsonrpc: '2.0', result: null, error: { code: -32000, message: 'Unexpected error.', data: error.stack }, id: req.body.id });
    return next();
  }
};
