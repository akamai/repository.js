"use strict";

var log = require("../util/log");
var api = require("../util/api-json");

/**
 * @class Tokens
 * @desc
 * Tokens takes care of requesting authentication from the Repository API endpoint and
 * fetching the API-Auth token used as a header value to inform the API of our allowance to talk to it
 */

/**
 * @constructor Tokens
 *
 * @param {string} serviceUrl - API endpoint URL
 */
function Tokens(serviceUrl) {
    this.endpoint = serviceUrl +
        (serviceUrl.indexOf("/services/rest/RepositoryService/v1") != -1 ?
            "/Tokens" :
            "/services/rest/RepositoryService/v1/Tokens");
}

/**
 * Authenticate with the API endpoint to get the API-Auth token
 *
 * @param {string} tenantName - name of the tenant we want to access
 * @param {string} userName - the username we want to authenticate with
 * @param {string} password - the password of the user we want to authenticate with
 * @param {function} callback -
 * [Called after the API Auth request was finalized]{@link Tokens~connect(callback)}
 */
Tokens.prototype.connect = function(tenantName, userName, password, callback) {
    log.debug("connect(tenantName=" + tenantName + ", userName=" + userName + ", password=" + password + ")");

    var credentials = {
        userName: userName,
        password: password
    };

    if (tenantName) {
        credentials.tenant = tenantName;
    }

    api(null, this.endpoint, "PUT", credentials, function(error, responseBody) {
        if (error) {
            // Request failed.
            callback(error, null);
        } else {
            // Success!

            // Response JSON will look like:
            // { "token": "<random string>" }

            // Extract the actual token and return that in the callback.
            callback(null, responseBody.token);
        }
    });
};
/**
 * @callback Tokens~connect(callback)
 *
 * @param {?Error} err - {@link null} or an Error object describing the type of Exception thrown by the authentication
 * @param {?string} token - Authentication token returned upon successfull authentication
 */

/**
 * Authenticate with the API endpoint to get the API-Auth token
 *
 * @param {string} tenantName - name of the tenant we want to access
 * @param {string} apiToken - the apiToken retrieved from mPulse UI
 * @param {function} callback -
 * [Called after the API Auth request was finalized]{@link Tokens~connect(callback)}
 */
Tokens.prototype.connectByApiToken = function(tenantName, apiToken, callback) {
    var credentials = {
        apiToken: apiToken
    };

    if (tenantName) {
        credentials.tenant = tenantName;
    }

    api(null, this.endpoint, "PUT", credentials, function(error, responseBody) {
        if (error) {
            // Request failed.
            callback(error, null);
        } else {
            // Success!

            // Response JSON will look like:
            // { "token": "<random string>" }

            // Extract the actual token and return that in the callback.
            callback(null, responseBody.token);
        }
    });
}

/**
 * Retrieve the token object associated with the current session
 * 
 * @param {string} token - the token id which is associated with the token object to extract
 * @param {function} callback - 
 * [Callback called after the request to get the token has completed]{@link Tokens~getToken(token, callback)}
 */
Tokens.prototype.getToken = function(token, callback) {
    api(null, this.endpoint + "/" + token, "GET", null, function(error, responseBody) {
        if (error) {
            // Request failed.
            callback(error, null);
        } else {
            // Success!
            callback(null, responseBody);
        }
    });
}
/**
 * @callback Tokens~getToken(token, callback)
 *
 * @param {?Error} err - {@link null} or an Error object describing the type of Exception that occured
 * during token extraction
 * @param {?string} responseBody - an empty String or null on error
 */

/**
 * Disconnect or deauthenticate from the repository API endpoint effectively invalidating the token
 *
 * @param {string} token - Token we intend to invalidate
 * @param {function} callback -
 * [Callback called once the API de-authentication was executed]{@link Tokens~disconnect(callback)}
 */
Tokens.prototype.disconnect = function(token, callback) {
    log.debug("disconnect()");

    var tokenURL = this.endpoint + "/" + token;
    api(null, tokenURL, "DELETE", null, callback);
};
/**
 * @callback Tokens~disconnect(callback)
 *
 * @param {?Error} err - {@link null} or an Error object describing the type of Exception that occured
 * during de-authentication
 * @param {?string} responseBody - an empty String or null on error
 */

module.exports = Tokens;
