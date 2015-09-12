"use strict";

function APIError(message, response, code) {
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    // Have to assign both otherwise node will not display an error message
    this.message = this.httpStatusMessage = message;
    this.detail = response;
    this.httpStatusCode = code;
}

require("util").inherits(APIError, Error);

module.exports = APIError;
