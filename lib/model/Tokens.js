"use strict";

var log = require("../util/log");
var api = require("../util/api");

/**
 * @class Tokens
 * @desc
 * Tokens takes care of requesting authentication from the Repository API endpoint and fetching the API-Auth token used as
 * a header value to inform the API of our allowance to talk to it
 */

/**
 * @constructor Tokens
 *
 * @param serviceUrl {String} - API endpoint URL
 * @return {Tokens} New instance of the Objects class
 */
function Tokens(serviceUrl) {
    this.endpoint = serviceUrl + "/Tokens";
}

/**
 * Authenticate with the API endpoint af bet the API-Auth token
 *
 * @param tenantName {String} - name of the tenant we want to access
 * @param userName {String} - the username we want to authenticate with
 * @param password {String} - the password of the user we want to authenticate with
 * @param {Tokens~connect(callback)} callback - A callback called after either a successfull or unsuccessfull execution of the authentication
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
 * @param err {(Error|null)} - {@link null} or an Error object describing the type of Exception thrown by the authentication
 * @param token {String} - Authentication token returned upon successfull authentication
 */

/**
 * Disconnect or deauthenticate from the repository API endpoint effectively invalidating the token
 *
 * @param token {String} - Token we intend to invalidate
 * @param {Tokens~disconnect(callback)} callback - Callback called once the API de-authentication was executed
 */
Tokens.prototype.disconnect = function(token, callback) {
    log.debug("disconnect()");

    var tokenURL = this.endpoint + "/" + token;
    api(null, tokenURL, "DELETE", null, callback);
};
/**
 * @callback Tokens~disconnect(callback)
 *
 * @param err {(Error|null)} - {@link null} or an Error object describing the type of Exception that occured during de-authentication
 * @param responseBody {(String|null)} - an empty String or null on error
 */

module.exports = Tokens;
