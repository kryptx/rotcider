'use strict';

const Base64url = require('base64url');
const Zlib = require('zlib');
const Promisify = require('util').promisify;
const Models = require('./models');

const EncodingVersion = 0;
const prependVersion = str => EncodingVersion + '/' + str;
const serialize = obj => obj.toJSON ? obj.toJSON() : obj;

const zip = Promisify(Zlib.deflate);
const unzip = Promisify(Zlib.unzip);

exports = module.exports = {
  marshal: async objects => {
    let strings = {};
    let typeNames = Object.keys(objects);
    for(let typeName of typeNames) {
      strings[typeName] = await exports.encode(objects[typeName].toJSON());
    }
    return strings;
  },

  encode: async pojo => {
    switch(EncodingVersion) {
    case 0:
    default:
      return zip(JSON.stringify(serialize(pojo)))
        .then(Base64url.encode)
        .then(prependVersion);
    }
  },

  // I'll admit this isn't the easiest thing in the world to read
  unmarshal: async strings => {
    let keys = Object.keys(strings);
    let values = await Promise.all(keys.map(name => exports.decode(strings[name])));
    return keys
      .map(name => Models[name])
      .map((Type, i) => Type.fromJSON(values[i]))
      .reduce((prev, curr, i) => {
        prev[keys[i]] = curr;
        return prev;
      }, {});
  },

  decode: async rawStr => {
    const [ version, value ] = rawStr.split('/');
    switch(version) {
    case '0':
    default:
      return unzip(Base64url.toBuffer(value)).then(JSON.parse);
    }
  }
};