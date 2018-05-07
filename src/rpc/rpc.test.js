/*eslint-env mocha */
'use strict';

const Assert = require('chai').assert;
const Joi = require('joi');
const Rpc = require('./rpc');

let rpc_options = {
  deps: {
    frobnicator: () => {
      return 'frobnicated';
    }
  },
  methods: {
    echo: {
      schema: Joi.any(),
      handle: async args => args
    }
  }
};


describe('RPC module', () => {
  it('stores methods for invocation', async () => {
    let rpc = new Rpc(rpc_options);
    let call = [{
      id: 'a duck',
      method: 'echo',
      params: 'QUACK'
    }, {
      id: 'another duck',
      method: 'echo',
      params: 'QUACK'
    }];

    Assert.deepEqual(rpc.methods, rpc_options.methods);

    let result = await rpc.RpcStuff(call, {});
    Assert.equal(result[0].result, 'QUACK');
    Assert.equal(result[1].result, 'QUACK');
  });
});