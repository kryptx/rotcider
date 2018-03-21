'use strict';

const Errors = require('common-errors');

module.exports = {
  joi: (joiError) => {
    let error = new Errors.ValidationError("The request was not valid.");
    // assuming abortEarly: false
    for (const err of joiError.details) {
      error.addError(new Errors.ValidationError(`${err.message} (Full path: ${err.path.join('.')})`))
    }
    return error;
  }
};
