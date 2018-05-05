'use strict';

const deps = require('./ripcord');
const methods = require('./methods');
const RpcOverHttp = require('./rpc/transports/http');

let app = new RpcOverHttp({ methods, deps });
app.listen();

module.exports = app;
