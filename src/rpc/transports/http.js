'use strict';

const Http = require('http');
const Rpc = require('../rpc');
const Serializers = require('../serializers');

class RpcOverHttp extends Rpc {
  constructor(options, deps) {
    super();
    this.server = Http.createServer(async (req, res) => {
      let serializer = this.getSerializer(req, Serializers);
      let payload = serializer.deserialize(req);
      let result;

      try {
        let state = await this.loadState(req, deps);
        result = await Rpc.RpcStuff(payload, deps, state);
      } catch (err) {
        result = err;
      }

      res.end(serializer.serialize(result));
    });

    this.port = options.port || 3000;
    this.log = deps.Log;
  }

  async listen() {
    this.server.listen(this.port);
    this.log.info(`HTTP Listener listening on port ${this.port}`);
  }

  async close() {
    this.server.close();
  }

  async loadState(req, { StateMarshal }) {
    let keys = Object.keys(req.cookies);
    return Promise.all(keys.map(key => StateMarshal.decode(req.cookies[key])));
  }

  getSerializer(req, Serializers) {
    // just for now
    return Serializers.JsonRpc;

    // later, a safe version of this
    // return {
    //   'application/json': Serializers.JsonRpc,
    //   'application/json-rpc': Serializers.JsonRpc
    // }[req.headers['content-type']];
  }

}

module.exports = RpcOverHttp;
