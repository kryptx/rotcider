/*eslint-env mocha */
'use strict';

const Assert = require('chai').assert;
const Reflect = require('./reflect');

describe('Reflect method', () => {
  it('should return the player state', async () => {
    const result = await Reflect.handle(null, null, { player: 'literally anything' });
    Assert.equal(result.player, 'literally anything');
  });
  it('should return a null player with a message if the character does not exist', async () => {
    const result = await Reflect.handle();
    Assert.isNotEmpty(result.message);
    Assert.isNull(result.player);
  });
});