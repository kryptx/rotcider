'use strict';

const App = require('./index');
const Request = require('supertest');
const Assert = require('chai').assert;

const PARSE_ERROR = -32700 // Invalid JSON was received by the server.
const INVALID_REQUEST = -32600; // The JSON sent is not a valid Request object.
const METHOD_NOT_FOUND = -32601; // The method does not exist / is not available.
const INVALID_PARAMS = -32602; // Invalid method parameter(s).
const INTERNAL_ERROR = -32603; // Internal JSON-RPC error.

const post = body => Request(App).post('/json-rpc').send(body)

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
    })
    .then(res => {
      Assert.equal(res.status, 500);
      Assert.equal(res.body.error.code, INVALID_REQUEST);
      Assert.equal(res.body.id, 'anything');
    });
  });

  it('should respond with method not found for invalid methods', () => {
    return post({
      jsonrpc: '2.0',
      method: 'doesnotexist',
      id: 5555
    })
    .then(res => {
      Assert.equal(res.status, 500);
      Assert.equal(res.body.error.code, METHOD_NOT_FOUND);
      Assert.equal(res.body.id, 5555);
    });
  });

  it('should return pong for ping', () => {
    return post({
      jsonrpc: '2.0',
      method: 'ping',
      id: 4242
    })
    .then(res => {
      Assert.equal(res.status, 200);
      Assert.equal(res.body.result, 'pong');
      Assert.equal(res.body.id, 4242);
    });
  });
});