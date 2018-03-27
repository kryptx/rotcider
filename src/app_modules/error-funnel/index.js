'use strict';

module.exports = {
  joi: (joiError, code) => ({
    code,
    message: code == -32600 ? "Invalid request." : "Invalid parameters.",
    data: joiError.details  // assuming abortEarly: false
  })
};
