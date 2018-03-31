/*eslint-env mocha */
'use strict';

const App = require('./app');
const Request = require('supertest');
const Assert = require('chai').assert;

// const PARSE_ERROR = -32700; // Invalid JSON was received by the server.
const INVALID_REQUEST = -32600; // The JSON sent is not a valid Request object.
const METHOD_NOT_FOUND = -32601; // The method does not exist / is not available.
// const INVALID_PARAMS = -32602; // Invalid method parameter(s).
// const INTERNAL_ERROR = -32603; // Internal JSON-RPC error.

const post = body => Request(App).post('/json-rpc').send(body);

describe('App', () => {
  it('should require jsonrpc 2.0', () => {
    return post({
      jsonrpc: 'anything but exactly 2.0',
      method: 'ping',
      id: 'something'
    })
    .then(res => {
      Assert.equal(res.status, 500);
      Assert.equal(res.body.error.code, INVALID_REQUEST);
      Assert.equal(res.body.id, 'something');
    });
  });

  it('should respond with invalid request if method is missing', () => {
    return post({
      jsonrpc: '2.0',
      id: 'anything'
    }).then(res => {
      Assert.equal(res.status, 500);
      Assert.equal(res.body.error.code, INVALID_REQUEST);
      Assert.equal(res.body.error.message, 'Invalid request.');
      Assert.equal(res.body.id, 'anything');
    });
  });

  it('should respond with method not found for invalid methods', () => {
    return post({
      jsonrpc: '2.0',
      method: 'doesnotexist',
      id: 5555
    }).then(res => {
      Assert.equal(res.status, 500);
      Assert.equal(res.body.error.code, METHOD_NOT_FOUND);
      Assert.equal(res.body.id, 5555);
    });
  });

  it('should return errors for notifications', () => {
    return post({
      jsonrpc: '2.0',
      method: 'doesnotexist'
    }).then(res => {
      Assert.equal(res.status, 500);
      Assert.equal(res.body.error.code, METHOD_NOT_FOUND);
      Assert.isNull(res.body.id);
    });
  });

  it('should return pong for ping', () => {
    return post({
      jsonrpc: '2.0',
      method: 'ping',
      params: 'whatevs',
      id: 4242
    }).then(res => {
      Assert.equal(res.status, 200);
      Assert.equal(res.body.result, 'pong');
      Assert.equal(res.body.id, 4242);
    });
  });

  it('should remain silent if no id is given', () => {
    return post({
      jsonrpc: '2.0',
      method: 'ping'
    }).then(res => {
      Assert.equal(res.status, 204);
      Assert.isEmpty(res.text);
    });
  });

  it('should send cookies in response to start', () => {
    return post({
      jsonrpc: '2.0',
      method: 'start',
      id: 'poop'
    }).then(res => {
      let cookies = res.header['set-cookie'].reduce((obj, cookie) => {
        let parts = cookie.split('=');
        obj[parts[0]] = parts[1];
        return obj;
      }, {});
      Assert.exists(cookies.world);
      Assert.exists(cookies.character);
    });
  });

  it('should allow batches', () => {
    return post([
      {
        jsonrpc: '2.0',
        method: 'ping',
        id: 1234
      },
      {
        jsonrpc: '2.0',
        method: 'ping'
      },
      {
        jsonrpc: '2.0',
        method: 'ping',
        id: 1236
      },
      {
        jsonrpc: '2.0',
        method: 'ping',
        id: 1237
      },
    ]).then(res => {
      Assert.equal(res.status, 200);
      Assert.equal(res.body.length, 3);
      Assert.deepEqual(
        [ res.body[0].id,
          res.body[1].id,
          res.body[2].id ].sort(),
        [1234, 1236, 1237]
      );
      Assert.equal(res.body[1].result, 'pong');
    });
  });
});