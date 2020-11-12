'use strict';

const Joi = require('joi');
const Items = [];

const schemas = {
  weapon: Joi.object().keys({
    damage: Joi.number().required(),
    range: Joi.number().required()
  }),
  armor: Joi.object().keys({
    protection: Joi.number().required()
  }),
  jewelry: Joi.object().keys({
    inspiration: Joi.number().required()
  }),
};

const schema = Joi.object().keys({
  type: Joi.string().valid('weapon','armor','jewelry','food','consumable','valuable','key').required(),
  weight: Joi.number().required(),
  value: Joi.number().required(),
  weapon: Joi.object().when('type', { is: 'weapon', then: schemas.weapon.required(), otherwise: Joi.forbidden() }),
  armor: Joi.object().when('type', { is: 'armor', then: schemas.armor.required(), otherwise: Joi.forbidden() }),
  jewelry: Joi.object().when('type', { is: 'jewelry', then: schemas.jewelry.required(), otherwise: Joi.forbidden() }),
});

exports = module.exports = {
  purge: () => Items.splice(0),
  schema,
  getById: id => Items[id] ? Object.assign({ id }, Items[id]) : null,
  insert: item => {
    let result;
    if(Array.isArray(item)) {
      result = Joi.array().items(schema).validate(item);
      if(result.error) throw result.error; // these are most likely to manifest as test failures
      Items.push(...result.value);
      return result.value.map(i => Items.indexOf(i));
    } else {
      // the else is unnecessary, but it makes the symmetry more obvious
      result = schema.validate(item);
      if(result.error) throw result.error;
      return Items.push(result.value) - 1;
    }
  },
  export: () => Items
};
