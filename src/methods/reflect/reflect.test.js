/*eslint-env mocha */
'use strict';

const Assert = require('chai').assert;
const Reflect = require('./index');

describe('Reflect method', () => {
  it('should serialize the character state', async () => {
    const result = await Reflect.handle(null, null, { character: { toJSON: () => 'literally anything' } });
    Assert.equal(result.character, 'literally anything');
  });
});