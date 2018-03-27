'use strict';

const Express = require('express');
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const JsonRPC = require('./json-rpc');
const RpcOverHTTP = require('./rpc-over-http');

const app = Express();
const deps = require('./app_modules');

app.use(CookieParser('secret!'));
app.post('/json-rpc', [
  BodyParser.json(),
  RpcOverHTTP.readState(deps),
  JsonRPC.handle(deps),
  RpcOverHTTP.writeState(deps),
  RpcOverHTTP.respond,
  RpcOverHTTP.handleError,
]);

console.log('listening on port 3000')
module.exports = app.listen(3000);
