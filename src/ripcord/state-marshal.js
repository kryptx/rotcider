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
  marshal: async (objects, encode = exports.encode) => {
    let strings = {};
    let typeNames = Object.keys(objects);
    for(let typeName of typeNames) {
      if(objects[typeName].toJSON) {
        strings[typeName] = await encode(objects[typeName].toJSON());
      } else {
        strings[typeName] = await encode(objects[typeName]);
      }
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

  // input is like  { world: 'a4fe588acb2-encoded-data-9db1c3' }
  // output is like { world: World { ... instance data ... } }
  unmarshal: async (strings, decode = exports.decode) => {
    let keys = Object.keys(strings);
    let values = await Promise.all(keys.map(name => decode(strings[name])));
    keys.forEach((name, i) => {
      if(Models[name]) {
        strings[name] = Models[name].fromJSON(values[i]);
      } else {
        strings[name] = values[i];
      }
    });
    return strings;
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