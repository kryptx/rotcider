/*eslint-env mocha */
'use strict';

const Assert = require('chai').assert;
const JsonRpc = require('./json-rpc');

describe('JSON-RPC', () => {
  describe('.check', () => {
    describe('for character', () => {
      it('should return a start hint if there is no character', () => {
        let result = JsonRpc.check([ 'character' ], {});
        Assert.equal(result.hint, 'start');
        Assert.notExists(result.character);
      });
      it('should return null (no violations) if the character exists', () => {
        let result = JsonRpc.check([ 'character' ], { character: { stuff: 'things' } });
        Assert.notExists(result);
      });
    });
    it('should handle no requirements', () => {
      let result = JsonRpc.check([ ], {});
      Assert.notExists(result);
    });
  });
});