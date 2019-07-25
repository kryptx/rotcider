/*eslint-env mocha */
'use strict';

const Assert = require('chai').assert;
const Joi = require('joi');
const Reflect = require('./index');

describe('reflect method', () => {
  describe('.handle', () => {
    it('should serialize the character state', async () => {
      const result = await Reflect.handle(null, null, { character: { toJSON: () => 'literally anything' } });
      Assert.equal(result.character, 'literally anything');
    });
  });

  describe('schema', () => {
    it('should not require any parameters', () => {
      let result = Joi.validate(null, Reflect.schema);
      Assert.notOk(result.error);
    });
  });
});