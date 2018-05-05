'use strict';

const deps = require('./ripcord');
const RpcOverHttp = require('./rpc/transports/http');

let app = new RpcOverHttp({}, deps);
app.listen();
