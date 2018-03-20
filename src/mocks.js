'use strict';

const Sinon = require('sinon');

const mocks = {
  get app() {
    return {
      characterRepository: {
        find: async function(...args) { return this.findStub(...args) },
        findStub: Sinon.stub(),
      }
    }
  },

  get express() {
    return {
      req: {},
      res: {
        send: Sinon.stub()
      },
      next: Sinon.stub()
    }
  }
};

module.exports = mocks;