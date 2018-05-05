'use strict';

const deps = require('./ripcord');
const methods = require('./methods');
const transports = require('./rpc/transports');
const serializers = require('./rpc/serializers');
const Rpc = require('./rpc/rpc');

let app = new Rpc({ methods, deps });
app.listen([
  new transports.HttpTransport({
    rpc: app,
    port: 3000,
    serializers: {
      'application/json': serializers.JsonRpc2,
      'application/json-rpc': serializers.JsonRpc2,
    }
  })
]);

module.exports = app;
