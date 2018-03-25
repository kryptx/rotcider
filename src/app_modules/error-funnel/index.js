'use strict';

module.exports = {
  joi: (joiError, code) => ({
    code,
    message: joiError.message,
    data: joiError.details  // assuming abortEarly: false
  })
};
