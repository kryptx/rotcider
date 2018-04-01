'use strict';

module.exports = [
  {
    name: 'Master Sword',
    type: 'weapon',
    weight: 5,
    value: 100,
    weapon: {
      damage: 8,
      range: 2
    }
  },
  {
    name: 'Steel Armor',
    description: 'Effective against crushing and stabbing attacks.',
    type: 'armor',
    weight: 10,
    value: 200,
    armor: {
      protection: 0.7
    }
  },
  {
    name: 'Glowing Amulet',
    description: 'May have magical properties.',
    type: 'jewelry',
    weight: 1,
    value: 350,
    jewelry: {
      inspiration: 7
    }
  },
  {
    name: 'Etched Longbow',
    description: 'And a million arrows.',
    type: 'weapon',
    weight: 3,
    value: 350,
    weapon: {
      damage: 4,
      range: 10
    }
  },
  {
    name: 'Golden Key',
    description: 'It\'s big. Looks important.',
    type: 'key',
    value: 500,
    weight: 1,
  },
  {
    name: 'Red Apple',
    description: 'Restores some health.',
    type: 'food',
    weight: 0.5,
    value: 5,
  }
];