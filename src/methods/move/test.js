/*eslint-env mocha */
'use strict';

const Assert = require('chai').assert;
const move = require('./index');

context('move method', () => {
  describe('.handle', () => {
    it('should echo the direction it is given', async () => {
      let result = await move.handle({ direction: 'right' });
      Assert.equal(result.moved, 'right');
    });
  });
});