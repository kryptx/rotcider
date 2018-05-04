'use strict';

const Http = require('http');
const RpcTransport = require('./rpc-transport');

class HttpTransport extends RpcTransport {
  constructor(options, deps) {
    super();
    this.server = Http.createServer(async (req, res) =>
      this.setSerializer(req, deps.Serializers)
        .then(() => this.RpcStuff(req))
        .then(res.end)
    );

    this.port = options.port || 3000;
    this.log = deps.Log;
  }

  async start() {
    this.server.listen(this.port);
    this.log.info(`HTTP Listener listening on port ${this.port}`);
  }

  async stop() {
    this.server.close();
  }

  async loadState(req, { StateMarshal }) {
    let keys = Object.keys(req.cookies);
    return Promise.all(keys.map(key => StateMarshal.decode(req.cookies[key])));
  }

  async setSerializer(req, Serializers) {
    this.serializer = {
      'application/json': Serializers.JsonRpc,
      'application/json-rpc': Serializers.JsonRpc
    }[req.headers['content-type']];
  }

}

module.exports = HttpTransport;
