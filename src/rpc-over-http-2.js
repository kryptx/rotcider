'use strict';

const Http = require('http');
const Transport = require('./transport');
const ProcedureCall = require('./procedure-call');

class HttpTransport extends Transport {
  constructor(deps) {
    super();
    this.server = Http.createServer(async (req, res) =>
      this.unwrap(req, deps.Serializers)
        .then(new ProcedureCall)
        .then(this.process)
        .then(this.wrap)
        .catch(e => e)
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
    let serializer = {
      'application/json': Serializers.JsonRpc,
      'application/json-rpc': Serializers.JsonRpc
    }[req.headers['content-type']];

    let call = serializer.deserialize(req.payload);

    return Promise.all({
      state: this.loadState(req),
      method: call.method,
      params: call.params,
      id: call.id
    });
  }

  async process(call) {

  }
}

module.exports = HttpTransport;
