"use strict";

/**
 * @class APIError
 * @extends Error
 * @constructor
 * @desc
 * Error type for API responses that are not successful. Used in API requests that succeed on transport but fail
 * at application layer.
 *
 * @param {string} message - Status message if available assigned to property: `statusMessage`
 * @param {Object} response - JSON Response Object returned from the Server and parsed to POJO
 * @param {number} code - HTTP StatusCode returned by the Server
 *
 * @property {string} APIError.name - "APIError"
 * @property {string} APIError.httpStatusMessage - If the Server responds with a HTTP Status Message it's assigned here
 * @property {number} APIError.httpStatusCode - HTTP Status Code returned by the Server
 * @property {Object} APIError.fault - Fault-Object containting the error code and message possibly returned by the
 * server or the servers HTTP response error
 * @property {string} APIError.fault.code - The failure code defined on the server
 * @property {string} APIError.fault.message - Human readable error message for the faults code
 * @property {string} APIError.message - if {@link APIError.fault.message} is defined by the server both will
 * have the same
 * value otherwise {@link APIError.httpStatusMessage}
 *
 * @example
 * new APIError("The object type 'foo' is not recognized.", {}, 400)
 * { [APIError: The object type 'foo' is not recognized.]
 *   name: 'APIError',
 *   httpStatusMessage: 'The object type \'foo\' is not recognized.',
 *   httpStatusCode: 400,
 *   fault: {},
 *   message: 'The object type \'foo\' is not recognized.' }
 *
 * @example
 * // Example Response by the Server
 * // This will be returned as property of APIError otherwise the Response is set as fault
 * {
 *   "fault":
 *   {
 *     "code": "PersistenceException.TypeNotRecognized",
 *     "message": "The object type 'foo' is not recognized."
 *   }
 * }
 */
function APIError(message, response, code) {
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.httpStatusMessage = message;
    this.httpStatusCode = code;

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
