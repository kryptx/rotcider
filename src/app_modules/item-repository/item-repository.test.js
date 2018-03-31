/*eslint-env mocha */
'use strict';

const ItemRepository = require('./index');
const Assert = require('chai').assert;

describe('Item Repository', () => {
  describe('insert', () => {
    beforeEach(() => ItemRepository.clear());

    it('should reject an item with an invalid schema', () => {
      try { ItemRepository.insert({ just: 'anything' }); }
      catch(e) {
        Assert.exists(e);
        return;
      }
      Assert(false, 'Expected an exception to be thrown.');
    });

    it('should save an item and return an id', () => {
      let id = ItemRepository.insert({
        type: 'food',
        weight: 2,
        value: 40
      });
      Assert.isNumber(id);
    });

    it('should require weapon details for a weapon type', () => {
      try {
        ItemRepository.insert({
          type: 'weapon',
          weight: 2,
          value: 40
        });
      }
      catch(e) {
        Assert.exists(e);
        return;
      }
      Assert(false, 'Expected an exception to be thrown.');
    });

    it('should require armor details for an armor type', () => {
      try {
        ItemRepository.insert({
          type: 'armor',
          weight: 3,
          value: 30
        });
      }
      catch(e) {
        Assert.exists(e);
        return;
      }
      Assert(false, 'Expected an exception to be thrown.');
    });

    it('should require jewelry details for a jewelry type', () => {
      try {
        ItemRepository.insert({
          type: 'jewelry',
          weight: 1,
          value: 300
        });
      }
      catch(e) {
        Assert.exists(e);
        return;
      }
      Assert(false, 'Expected an exception to be thrown.');
    });

    it('should disallow weapon, armor, jewelry data for other types', () => {
      let errors = [];
      try {
        ItemRepository.insert({
          type: 'food',
          weight: 1,
          value: 300,
          jewelry: { inspiration: 10 }
        });
      }
      catch(e) {
        errors.push(e);
      }
      try {
        ItemRepository.insert({
          type: 'valuable',
          weight: 1,
          value: 300,
          weapon: {
            damage: 10,
            range: 2
          }
        });
      }
      catch(e) {
        errors.push(e);
      }
      try {
        ItemRepository.insert({
          type: 'consumable',
          weight: 1,
          value: 300,
          armor: {
            protection: -5
          }
        });
      }
      catch(e) {
        errors.push(e);
      }
      Assert.equal(errors.length, 3);
    });

    it('should be able to import batch of data', () => {
      let items = [
        {
          type: 'weapon',
          weight: 3,
          value: 40,
          weapon: {
            damage: 8,
            range: 2
          }
        },
        {
          type: 'armor',
          weight: 5,
          value: 60,
          armor: {
            protection: 10
          }
        },
        {
          type: 'jewelry',
          weight: 5,
          value: 60,
          jewelry: {
            inspiration: 69
          }
        },
        {
          type: 'food',
          weight: 5,
          value: 60
        },
      ];
      let ids = ItemRepository.insert(items);
      for(let i = 0; i < ids.length; i ++) {
        Assert.deepEqual(ItemRepository.getById(ids[i]), Object.assign({ id: ids[i] }, items[i]));
      }
    });
  });
  it('should be able to export all of its data');
});