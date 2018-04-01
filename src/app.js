'use strict';

const Express = require('express');
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const JsonRpc = require('./json-rpc');
const RpcOverHttp = require('./rpc-over-http');

const app = Express();
const deps = require('./ripcord');
const Log = deps.Log;

app.use(CookieParser('secret!'));
app.post('/json-rpc', [
  BodyParser.json(),
  RpcOverHttp.readState(deps),
  JsonRpc.express(deps),
  RpcOverHttp.writeState(deps),
  RpcOverHttp.respond,
  RpcOverHttp.handleError,
  RpcOverHttp.logRequest(deps),
]);

Log.info('Listening on port 3000');
module.exports = app.listen(3000);
