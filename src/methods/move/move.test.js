/*eslint-env mocha */
'use strict';

const Assert = require('chai').assert;
const move = require('./index');
const World = require('../../ripcord').World;

// let rooms = [];
// for(let i = 0; i < 5; i++) {
//   let room = new Room();
//   if(i > 0) {
//     room = rooms[i - 1].addConnection('n', new Room());
//   }
//   rooms.push(room);
// }

let world = new World();

context('move method', () => {
  let state = { character: { room: world.start }};
  describe('.handle', () => {
    beforeEach(() => state = { character: { room: world.start }, world });

    it('should require a character', () => {
      Assert.include(move.requirements, 'character');
    });

    it('should not move in a direction with no exit', async () => {
      let result = await move.handle({ direction: 'RIGHT' }, null, state);
      Assert.exists(result);
      // Assert.equal(result.room, world.start);
    });

    // it('should move one unit', async () => {
    //   let result = await move.handle({ direction: 'FORward' }, null, state);
    //   Assert.exists(result);
    //   Assert.equal(result.room, rooms[1]);
    // });
  });
});
