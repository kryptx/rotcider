'use strict';

class Transport {
  constructor() {}
  async call() { throw new Error('Not implemented!'); }
  async start() { throw new Error('Not implemented!'); }
  async stop() { throw new Error('Not implemented!'); }
}

module.exports = Transport;
