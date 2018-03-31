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
        Assert.equal(stubs.StateMarshal.decode.callCount, 3);
        Assert.deepEqual(stubs.StateMarshal.decode.firstCall.args, [ stubs.req.cookies.one ]);
        Assert.deepEqual(stubs.StateMarshal.decode.secondCall.args, [ stubs.req.cookies.two ]);
        Assert.deepEqual(stubs.StateMarshal.decode.thirdCall.args, [ stubs.req.cookies.three ]);
        Assert.deepEqual(stubs.res.locals.state, stubs.req.cookies);
      });
    });
  });

  describe('writeState method', () => {
    it('should use the state marshal to encode cookies and send them', () => {
      stubs.res.locals.state = sampleState;
      RpcOverHttp.writeState(stubs)(stubs.req, stubs.res, () => {
        Assert.deepEqual(stubs.StateMarshal.encode.firstCall.args, [ stubs.res.locals.state.one ]);
        Assert.deepEqual(stubs.StateMarshal.encode.secondCall.args, [ stubs.res.locals.state.two ]);
        Assert.deepEqual(stubs.StateMarshal.encode.thirdCall.args, [ stubs.res.locals.state.three ]);
        Assert.deepEqual(stubs.res.cookie.firstCall.args, ['one', stubs.res.locals.state.one ]);
        Assert.deepEqual(stubs.res.cookie.secondCall.args, ['two', stubs.res.locals.state.two ]);
        Assert.deepEqual(stubs.res.cookie.thirdCall.args, ['three', stubs.res.locals.state.three ]);
      });
    });
  });
});