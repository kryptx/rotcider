'use strict';

const ProcedureCall = require('./procedure-call');

class RpcTransport {
  constructor() {}

  async call() { throw new Error('Not implemented!'); }
  async start() { throw new Error('Not implemented!'); }
  async stop() { throw new Error('Not implemented!'); }

  deserialize(thing) {
    if(!this.serializer) throw new Error('Missing serializer');
    return this.serializer.deserialize(thing);
  }

  serialize(thing) {
    if(!this.serializer) throw new Error('Missing serializer');
    return this.serializer.serialize(thing);
  }

  RpcStuff(procedureOptions) {
    return Promise.resolve(new ProcedureCall(procedureOptions))
      .then(call => call.execute())
      .then(this.serialize)
      .catch(this.serialize);
  }
}

module.exports = RpcTransport;
