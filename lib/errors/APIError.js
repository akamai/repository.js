"use strict";

function APIError(message, response, code) {
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.httpStatusMessage = message;
    this.httpStatusCode = code;

    // Example of error JSON:
    // {
    //   "fault":
    //   {
    //     "code": "PersistenceException.TypeNotRecognized",
    //     "message": "The object type 'foo' is not recognized."
    //   }
    // }

    // If the JSON matches what we expect, then just "inline" the fault object.
    if (response && response.fault) {
        this.fault = response.fault;

        // If the fault includes a message (which it should), then use that as
        // the mssage for this Error object.  Otherwse, we'll take the HTTP response
        // message instead (see below).
        if (this.fault.message) {
            this.message = this.fault.message;
        }
    } else {
        // The JSON doesn't match the expected format.
        // Something weird is going on.  For now, just stash the whole thing as the fault object.
        this.fault = response;
    }

    if (!this.message) {
        this.message = this.httpStatusMessage;
    }
}

require("util").inherits(APIError, Error);

module.exports = APIError;
