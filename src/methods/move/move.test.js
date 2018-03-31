/*eslint-env mocha */
'use strict';

const Assert = require('chai').assert;
const move = require('./index');

context('move method', () => {
  let state = { player: { location: [ 5, 1, 5 ] }};
  describe('.handle', () => {
    beforeEach(() => state = { player: { location: [0, 0, 0] }, world: [ [ [null] ] ] });
    it('should not be able to move from a null room', async () => {
      let result = await move.handle({ direction: 'RIGHT' }, null, state);
      Assert.isUndefined(result.location);
    });
  });
});