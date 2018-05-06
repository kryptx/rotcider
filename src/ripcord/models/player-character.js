'use strict';

exports = module.exports = class PlayerCharacter {
  constructor(input = {}) {
    Object.assign(this, {
      room: null,
      inventory: [],
      facing: 'n',
      attributes: {
        maxHealth: 10,
        health: 10,
        strength: 5,
        dexterity: 5,
        wisdom: 5,
      }
    }, input);
  }

  get equipped() {
    return this.inventory
      .filter(i => i.equipped)
      .reduce((prev, curr) => {
        prev[curr.type] = curr;
        return prev;
      }, {});
  }

  toJSON() {
    return {
      inventory: this.inventory,
      attributes: this.attributes,
      room: this.room.toJSON(),
      facing: this.facing,
    };
  }

  static fromJSON(input) {
    return new PlayerCharacter(input);
  }
};