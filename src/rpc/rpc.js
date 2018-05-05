'use strict';

const ProcedureCall = require('./procedure-call');

class Rpc {

  constructor({ methods }) {
    this.methods = methods;
  }

  async RpcStuff(payload, deps, state) {
    const do_procedure = async input => {
      let options = Object.assign(input, { method: this.methods[input.method] });
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

module.exports = Rpc;
