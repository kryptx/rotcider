/*eslint-env mocha */
'use strict';

const Assert = require('chai').assert;
const JsonRpc = require('./json-rpc');

describe('JSON-RPC', () => {
  describe('.check', () => {
    describe('for player', () => {
      it('should return a start hint if there is no player', () => {
        let result = JsonRpc.check([ 'player' ], {});
        Assert.equal(result.hint, 'start');
        Assert.notExists(result.player);
      });
      it('should return null (no violations) if the player exists', () => {
        let result = JsonRpc.check([ 'player' ], { player: { stuff: 'things' } });
        Assert.notExists(result);
      });
    });
    it('should handle no requirements', () => {
      let result = JsonRpc.check([ ], {});
      Assert.notExists(result);
    });
  });
});