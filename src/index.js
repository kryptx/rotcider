'use strict';

const Express = require('express');
const BodyParser = require('body-parser');
const JsonRPC = require('./json-rpc');

const app = Express();
const deps = require('./app_modules');

app.post('/json-rpc', [
  BodyParser.json(),
  JsonRPC.validate(deps),
  JsonRPC.handle(deps),
  JsonRPC.handleError
]);

console.log('listening on port 3000')
module.exports = app.listen(3000);
