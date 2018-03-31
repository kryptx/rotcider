/*eslint-env mocha */
'use strict';

const Sinon = require('sinon');
const RpcOverHttp = require('./rpc-over-http');
const Assert = require('chai').assert;

let stubs;
const sampleState = {
  one: '1',
  two: [ 2, 'II' ],
  three: {
    number: 3,
    string: '3'
  }
};

describe('rpc-over-http module', () => {
  beforeEach(() => stubs = {
    req: {
      cookies: {}
    },
    res: {
      locals: {},
      cookie: Sinon.stub()
    },
    StateMarshal: {
      encode: Sinon.stub().returnsArg(0),
      decode: Sinon.stub().returnsArg(0)
    }
  });

  describe('readState method', () => {
    it('should use the state marshal to decode cookies from request', () => {
      stubs.req.cookies = sampleState;
      RpcOverHttp.readState(stubs)(stubs.req, stubs.res, () => {
        let decode = stubs.StateMarshal.decode;
        Assert.equal(decode.callCount, 3);
        Assert.deepEqual(decode.firstCall.args, [ sampleState.one ]);
        Assert.deepEqual(decode.secondCall.args, [ sampleState.two ]);
        Assert.deepEqual(decode.thirdCall.args, [ sampleState.three ]);
        Assert.deepEqual(stubs.res.locals.state, sampleState);
      });
    });
  });

  describe('writeState method', () => {
    it('should use the state marshal to encode cookies and send them', () => {
      stubs.res.locals.state = sampleState;
      RpcOverHttp.writeState(stubs)(stubs.req, stubs.res, () => {
        let encode = stubs.StateMarshal.encode;
        let cookies = stubs.res.cookie;
        Assert.deepEqual(encode.firstCall.args, [ sampleState.one ]);
        Assert.deepEqual(encode.secondCall.args, [ sampleState.two ]);
        Assert.deepEqual(encode.thirdCall.args, [ sampleState.three ]);
        Assert.deepEqual(cookies.firstCall.args, ['one', sampleState.one ]);
        Assert.deepEqual(cookies.secondCall.args, ['two', sampleState.two ]);
        Assert.deepEqual(cookies.thirdCall.args, ['three', sampleState.three ]);
      });
    });
  });
});