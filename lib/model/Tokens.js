"use strict";

var log = require("../util/log");
var api = require("../util/api-json");

function Tokens(serviceUrl) {
    this.endpoint = serviceUrl + "/Tokens";
}

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

Tokens.prototype.disconnect = function(token, callback) {
    log.debug("disconnect()");

    var tokenURL = this.endpoint + "/" + token;
    api(null, tokenURL, "DELETE", null, callback);
};

module.exports = Tokens;
