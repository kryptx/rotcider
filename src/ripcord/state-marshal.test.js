/*eslint-env mocha */
'use strict';

const StateMarshal = require('./state-marshal');
const Assert = require('chai').assert;

// name like "modem"
const endec = async orig => {
  let encoded = await StateMarshal.encode(orig);
  let decoded = await StateMarshal.decode(encoded);
  Assert.deepEqual(decoded, orig);
};

describe('State Marshal', () => {
  it('should unmarshal a whole state object containing multiple encoded objects', async () => {
    let decode = str => str.toUpperCase();
    let result = await StateMarshal.unmarshal({ foo: 'foo', bar: 'bar' }, decode);
    Assert.equal(result.foo, 'FOO');
    Assert.equal(result.bar, 'BAR');
  });

  it('should marshal state into a state object containing multiple encoded objects', async () => {
    let encode = obj => { obj.encoded = true; return obj; };
    let result = await StateMarshal.marshal({ foo: { name: 'foo' }, bar: { name: 'bar' } }, encode);
    Assert.isTrue(result.foo.encoded);
    Assert.isTrue(result.bar.encoded);
  });

  it('should encode and decode a simple object', async () => {
    return endec({ foo: 'bar', number: 5, boolean: false, missing: null });
  });

  it('should be able to encode and decode an array, preserving order', async () => {
    return endec([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);
  });

  it('should handle arrays as properties', async () => {
    return endec({ someValue: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ] });
  });

  it('should handle mixed arrays', async () => {
    return endec({
      someValues: [
        // we cannot use 'undefined'; that is not valid JSON
        // and therefore not allowed in JSON-RPC (a good thing)
        'staple',
        { horse: 'battery', five: ['12', 22 ] },
        12, null, true
      ]
    });
  });

  it('should handle nested arrays', async () => {
    return endec([ 1, 2, 3, [ 0, 1, 1, 0 ], [ 2, 0, [ 3, 5 ]]]);
  });
});