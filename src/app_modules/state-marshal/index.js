'use strict';

const Base64url = require('base64url');
const Zlib = require('zlib');
const Promisify = require('util').promisify;
const EncodingVersion = 0;

const zip = Promisify(Zlib.deflate);
const unzip = Promisify(Zlib.unzip);
const prependVersion = str => EncodingVersion + '/' + str;

exports = module.exports = {
  encode: async pojo => {
    switch(EncodingVersion) {
      case 0:
      default:
        return Promise.resolve(pojo)
          .then(JSON.stringify)
          .then(zip)
          .then(Base64url.encode)
          .then(prependVersion);
        break;
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
          .then(JSON.parse);
        break;
    }
  }
}