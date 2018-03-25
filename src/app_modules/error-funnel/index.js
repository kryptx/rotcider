'use strict';

const Errors = require('common-errors');

module.exports = {
  joi: (joiError, code) => ({
    code,
    message: joiError.message,
    data: joiError.details  // assuming abortEarly: false
  })
};
