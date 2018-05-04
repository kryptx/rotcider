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

  getSerializer(id) {
    if(!this.serializer) throw new Error('Missing serializer');
    return (thing) => this.serializer.serialize(thing, id);
  }

  RpcStuff(req) {
    const do_procedure = async options => {
      let proc = new ProcedureCall(options);
      return await proc.execute()
        .then(this.serialize(proc.id))
        .catch(this.serialize(proc.id));
    };

    let call = this.deserialize(req.payload);

    if(Array.isArray(call)) {
      return Promise.all(call.map(do_procedure));
    } else {
      return do_procedure(call);
    }
  }
}

module.exports = RpcTransport;
