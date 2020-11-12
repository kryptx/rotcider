/*eslint-env mocha */
'use strict';

const Assert = require('chai').assert;
const move = require('./index');
const deps = require('../../ripcord');
const { world: World } = deps.Models;

context('move method', () => {
  let state, world;
  describe('.handle', () => {
    beforeEach(() => {
      world = new World();
      world.addRoom(world.start.addConnection('n'));
      state = { character: { room: world.start, facing: 'n' }, world };
    });

    it('should require a character', () => {
      Assert.include(move.requirements, 'character');
    });

    it('should not move in a direction with no exit', async () => {
      let result = await move.handle({ direction: 'RIGHT' }, deps, state);
      Assert.exists(result);
      Assert.deepEqual(result.room, state.world.start.toJSON());
    });

    it('should move one unit', async () => {
      let result = await move.handle({ direction: 'FORward' }, deps, state);
      Assert.exists(result);
      Assert.equal(result.room, state.world.rooms[1]);
    });

  });

  describe('schema', () => {
    it('should require direction parameter', () => {
      let result = move.schema.validate({});
      Assert.equal('direction', result.error.details[0].context.label);
    });
  });
});
