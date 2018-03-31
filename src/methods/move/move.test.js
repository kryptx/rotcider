/*eslint-env mocha */
'use strict';

const Assert = require('chai').assert;
const move = require('./index');
const Room = require('../../app_modules').Room;

let rooms = [];
for(let i = 0; i < 5; i++) {
  let opts = { exits: {} };
  let room = new Room(opts);
  if(i > 0) {
    opts.exits.s = rooms[i - 1];
    room = new Room(opts);
    rooms[i - 1].addExit('n', room);
  }
  rooms.push(room);
}

const hallwayWorld = [ [ rooms ] ];

context('move method', () => {
  let state = { character: { location: [ 0, 0, 0 ] }};
  describe('.handle', () => {
    beforeEach(() => state = { character: { location: [0, 0, 0] }, world: hallwayWorld });

    it('should require a character', () => {
      Assert.include(move.requirements, 'character');
    });

    it('should not move in a direction with no exit', async () => {
      let result = await move.handle({ direction: 'RIGHT' }, null, state);
      Assert.exists(result);
      // don't compare to state.character.location. that may have changed
      Assert.deepEqual(result.location, [ 0, 0, 0 ]);
    });

    it('should move one unit', async () => {
      let result = await move.handle({ direction: 'FORward' }, null, state);
      Assert.exists(result);
      Assert.deepEqual(result.location, [ 0, 0, 1 ]);
    });
  });
});
