'use strict';

const Http = require('http');
const RpcTransport = require('./rpc-transport');

class HttpTransport extends RpcTransport {
  constructor(deps) {
    super();
    this.server = Http.createServer(async (req, res) =>
      this.unwrap(req, deps.Serializers)
        .then(this.RpcStuff)
        .then(res.end)
    );

    this.log = deps.Log;
  }

  async start() {
    this.server.listen(3000);
    this.log.info('HTTP Listener listening on port 3000');
  }

  async stop() {
    this.server.close();
  }

  async loadState(req, { StateMarshal }) {
    let keys = Object.keys(req.cookies);
    return Promise.all(keys.map(key => StateMarshal.decode(req.cookies[key])));
  }

  async unwrap(req, Serializers) {
    this.serializer = {
      'application/json': Serializers.JsonRpc,
      'application/json-rpc': Serializers.JsonRpc
    }[req.headers['content-type']];

    let call = this.deserialize(req.payload);

    return Promise.all({
      state: this.loadState(req),
      method: call.method,
      params: call.params,
      id: call.id
    });
  }

}

module.exports = HttpTransport;
