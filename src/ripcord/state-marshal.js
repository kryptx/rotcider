'use strict';

const Base64url = require('base64url');
const Zlib = require('zlib');
const Promisify = require('util').promisify;
const Log = require('./logger');

const EncodingVersion = 0;
const prependVersion = str => EncodingVersion + '/' + str;
const serialize = obj => obj.toJSON ? obj.toJSON() : obj;
const print = obj => {
  Log.info(obj);
  return obj;
};

const zip = Promisify(Zlib.deflate);
const unzip = Promisify(Zlib.unzip);

exports = module.exports = {
  encode: async pojo => {
    switch(EncodingVersion) {
    case 0:
    default:
      return Promise.resolve(pojo)
        .then(serialize)
        .then(JSON.stringify)
        .then(zip)
        .then(Base64url.encode)
        .then(prependVersion);
    }
  },
  decode: async rawStr => {
    const [ version, value ] = rawStr.split('/');
    switch(version) {
    case '0':
    default:
      return Promise.resolve(value)
        .then(Base64url.toBuffer)
        .then(unzip)
        .then(JSON.parse)
        .then(print);
    }
  }
};