'use strict';

const Express = require('express');
const JsonRPC = require('./json-rpc');

const app = Express();
const deps = require('./app_modules');

app.post('/json-rpc', [
  JsonRPC.validate,
  JsonRPC.handle(deps),
  JsonRPC.handleError
]);

module.exports = app.listen(3000);
