'use strict';

const ProcedureCall = require('./procedure-call');

class RpcTransport {
  async listen() { throw new Error('Not implemented!'); }
  async close() { throw new Error('Not implemented!'); }

  static async RpcStuff(payload, deps, state) {
    const do_procedure = async options => {
      let proc = new ProcedureCall(options);
      return proc.execute(deps, state);
    };

    if(Array.isArray(payload)) {
      return Promise.all(payload.map(do_procedure));
    } else {
      return do_procedure(payload);
    }
  }
}

module.exports = RpcTransport;
