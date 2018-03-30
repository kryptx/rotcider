'use strict';

const Express = require('express');
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const JsonRpc = require('./json-rpc');
const RpcOverHttp = require('./rpc-over-http');

const app = Express();
const self = require('./app_modules');

app.use(CookieParser('secret!'));
app.post('/json-rpc', [
  BodyParser.json(),
  RpcOverHttp.readState(self),
  JsonRpc.express(self),
  RpcOverHttp.writeState(self),
  RpcOverHttp.respond,
  RpcOverHttp.handleError,
]);

self.Log.info('Listening on port 3000');
module.exports = app.listen(3000);
