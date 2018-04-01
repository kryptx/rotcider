'use strict';

exports = module.exports = {
  list: [ 'n', 's', 'e', 'w', 'u', 'd' ],
  move: ([ x, y, z ], direction) => {
    const ops = {
      n: () => z++,
      e: () => x++,
      s: () => z--,
      w: () => x--,
      u: () => y++,
      d: () => y--
    };

    ops[direction]();

    return [ x, y, z ];
  },
  opposite: direction => {
    const results = {
      n: 's',
      s: 'n',
      e: 'w',
      w: 'e',
      u: 'd',
      d: 'u',
    };
    return results[direction];
  },
  right: facing => {
    const results = {
      n: 'e',
      s: 'w',
      e: 's',
      w: 'n',
    };
    return results[facing];
  },
  normalize: (input, facing) => {
    return input.toLowerCase()
      .substr(0, 1)
      .replace('f', facing)
      .replace('r', exports.right(facing))
      .replace('b', exports.opposite(facing))
      .replace('l', exports.opposite(exports.right(facing)));
  }
};