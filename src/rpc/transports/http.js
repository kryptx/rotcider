'use strict';

const Http = require('http');
const Cookie = require('cookie');

class HttpTransport {

  static async readState(headers) {
    return Cookie.parse(headers.cookie || '');
  }

  static async writeState(state, res) {
    let cookies = [];
    let keys = Object.keys(state);
    for(let key of keys) {
      cookies.push(Cookie.serialize(key, state[key]));
    }
    res.setHeader('Set-Cookie', cookies);
  }

  constructor({ rpc, serializers, readState, writeState }) {
    this.rpc = rpc;
    this.serializers = serializers;

    readState = readState || this.readState;
    writeState = writeState || this.writeState;

    this.server = Http.createServer(async (req, res) => {
      let serializer = this.getSerializer(req.headers['content-type']);
      let code = 200;
      let result, state;

      try {
        let args = await Promise.all([
          this.getBody(req).then(serializer.deserialize),
          state = readState(req.headers)
        ]);
        result = await this.rpc.RpcStuff(...args);
      } catch (err) {
        // I believe RPC over HTTP should always use 500,
        // even when the error is better described by another code
        // the client should not be able to infer anything from the transport
        code = 500;
        result = err;
      }

      state = await state;
      await writeState(state, res);
      let response = serializer.serialize(result);
      if(response) {
        res.writeHead(code, { 'Content-type': serializer.ContentType });
        res.write(response);
      } else {
        res.writeHead(204);
      }
      res.end();
    });
  }

  async getBody(req) {
    return new Promise(resolve => {
      let body = '';
      req.on('data', data => body += data);
      req.on('end', () => resolve(body));
    });
  }

  async listen(port) {
    return this.server.listen(port);
  }

  async close() {
    this.server.close();
    return this.server;
  }

  getSerializer(type) {
    return this.serializers[type] || this.serializers['application/json'];
  }
}

module.exports = HttpTransport;
