'use strict';

const Http = require('http');
const Cookie = require('cookie');

class HttpTransport {
  constructor({ rpc, port, serializers, readState }) {
    this.rpc = rpc;
    this.serializers = serializers;

    if(!readState) {
      readState = async headers => {
        return Cookie.parse(headers.cookie);
      };
    }

    this.server = Http.createServer(async (req, res) => {
      let serializer = this.getSerializer(req.headers['content-type']);
      let result;

      try {
        let args = await Promise.all([
          serializer.deserialize(req),
          readState(req.headers),
        ]);

        result = await this.rpc.RpcStuff(...args);
      } catch (err) {
        result = err;
      }

      let response = serializer.serialize(result);
      if(response) {
        res.writeHead(200, { 'Content-type': serializer.ContentType });
        res.write(response);
      } else {
        res.writeHead(204);
      }
      res.end();
    });

    this.port = port || 3000;
  }

  async listen({ Log }) {
    this.server.listen(this.port);
    Log.info(`HTTP Listener listening on port ${this.port}`);
  }

  async close() {
    this.server.close();
  }

  async loadState(req, { StateMarshal }) {
    let keys = Object.keys(req.cookies);
    return Promise.all(keys.map(key => StateMarshal.decode(req.cookies[key])));
  }

  getSerializer(type) {
    return this.serializers[type] || this.serializers.JsonRpc2;
  }

}

module.exports = HttpTransport;
