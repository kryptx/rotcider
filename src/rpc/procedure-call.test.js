/*eslint-env mocha */
'use strict';

const Assert = require('chai').assert;
const Joi = require('joi');
const ProcedureCall = require('./procedure-call');
const Sinon = require('sinon');

const options = {
  id: 616,
  method: {
    schema: Joi.any(),
    handle: Sinon.stub().returns(Promise.resolve('result'))
  },
  params: {
    taco: 'bar'
  }
};

describe('ProcedureCall', () => {
  it('should require a method', () => {
    let opts = Object.assign({}, options);
    delete opts.method;
    try {
      new ProcedureCall(opts);
      Assert(false, 'Expected constructor to throw');
    } catch (e) {
      Assert.exists(e);
      Assert.instanceOf(e, Error);
    }
  });

  it('should not allow method to be a string', () => {
    let opts = Object.assign({}, options);
    opts.method = 'something';
    try {
      new ProcedureCall(opts);
      Assert(false, 'Expected constructor to throw');
    } catch (e) {
      Assert.exists(e);
      Assert.instanceOf(e, Error);
    }
  });

  describe('.execute()', () => {
    it('should call the handle method', () => {
      options.method.handle.resetHistory();
      let proc = new ProcedureCall(options);
      proc.execute();
      Assert.equal(options.method.handle.callCount, 1);
    });
  });
});