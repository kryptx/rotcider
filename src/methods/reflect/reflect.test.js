/*eslint-env mocha */
'use strict';

const Assert = require('chai').assert;
const Reflect = require('./index');

describe('Reflect method', () => {
  it('should return the player state', async () => {
    const result = await Reflect.handle(null, null, { player: 'literally anything' });
    Assert.equal(result.player, 'literally anything');
  });
});