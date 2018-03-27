'use strict';

exports = module.exports = class PlayerCharacter {
  constructor(input = {}) {
    this.location = input.location || [ 5, 1, 5 ];
    this.inventory = input.inventory || [];
    this.attributes = input.attributes || {
      maxHealth: 10,
      health: 10,
      strength: 5,
      dexterity: 5,
      wisdom: 5,
    };
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
      equipped: this.equipped,
      location: [ 5, 1, 5 ]
    }
  }

  static fromJSON(input) {
    return new PlayerCharacter(input);
  }
}