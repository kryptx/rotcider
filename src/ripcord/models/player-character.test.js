/*eslint-env mocha */
'use strict';

const Assert = require('chai').assert;
const PlayerCharacter = require('./player-character');

const options = {
  facing: 'e',
};

describe('PlayerCharacter', () => {
  let character;
  beforeEach(() => {
    character = new PlayerCharacter(options);
  });

  describe('constructor', () => {
    it('should construct a PlayerCharacter with the desired options', () => {
      Assert.typeOf(character, 'object');
      Assert.equal(character.constructor.name, 'PlayerCharacter');
      Assert.equal(character.facing, options.facing);
    });
  });

  describe('.equipped', () => {
    it('should return a list of equipped items', () => {
      let item1 = { name: 'A carried item', equipped: false, type: 'weapon' };
      let item2 = { name: 'An equipped item', equipped: true, type: 'weapon' };
      character.inventory = [ item1, item2 ];
      let equippedItems = character.equipped;
      Assert.deepEqual(Object.keys(equippedItems), [ 'weapon' ]);
      Assert.equal(equippedItems.weapon, item2);
    });
  });
});