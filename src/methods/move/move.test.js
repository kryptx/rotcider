/*eslint-env mocha */
'use strict';

const Assert = require('chai').assert;
const move = require('./index');

context('move method', () => {
  describe('.handle', () => {
    it('should not be able to move from a null room', async () => {
      let result = await move.handle({ direction: 'RIGHT' });
      Assert.isUndefined(result.location);
      Assert.equal(result.hint, 'start');
    });
  });
});