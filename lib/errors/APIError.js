"use strict";

function APIError(message, response, code) {
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
    this.response = response;
    this.code = code;
}

require("util").inherits(APIError, Error);

module.exports = APIError;
