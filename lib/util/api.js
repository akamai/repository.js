"use strict";

var log = require("./log");

var url = require("url");
var http = require("http");
var https = require("https");

/**
 * @namespace Util
 * @function api
 *
 * @param token {String} - API-Auth token
 * @param endpoint {String} - URL to the API endpoint
 * @param method {String} - HTTP Method use with the API call
 * @param requestBody {String|null} - A string of HTTP request body content if we choose to POST to the API
 * @param {global~api(callback)} callback - A callback called after the API request was finalized
 */
function api(token, endpoint, method, requestBody, callback) {
    log.debug("sendRequest(endpoint=" + endpoint + ", method=" + method + ", requestBody=" + requestBody + ")");

    if (typeof requestBody === "object") {
        requestBody = JSON.stringify(requestBody);
        log.debug("Serialized requestBody to: " + requestBody);
    }

    var headers = {
        "Connection": "close"
    };

    if (requestBody) {
        headers["Content-Type"] = "application/json";
        headers["Content-Length"] = requestBody.length;
    }

    if (token) {
        headers["X-Auth-Token"] = token;
    }

    var options = url.parse(endpoint);
    options.method = method;
    options.headers = headers;

    var protocol = options.protocol === "http:" ? http : https;

    var responseBody = "";

    var req = protocol.request(options, function(response) {
        response.on("data", function(chunk) {
            responseBody += chunk;
        });

        response.on("end", function() {
            var responseCode = response.statusCode;
            log.debug("Got response code: " + responseCode + ", response body: " + responseBody);

            if (callback) {
                if (responseBody.trim().length === 0) {
                    responseBody = null;
                } else {
                    // TODO: Extra-kludgey kludge that needs to go away!  When I'm less tired.
                    var responseIsJSON = endpoint.indexOf("/SeedData/") < 0;

                    if (responseIsJSON) {
                        responseBody = JSON.parse(responseBody);
                    }
                }

                // Consider anything in the 200-299 range to be success.
                var error = null;
                if (responseCode < 200 || responseCode >= 300) {
                    // Request failed.
                    error = {
                        code: responseCode,
                        message: response.statusMessage
                    };
                }

                callback(error, responseBody);
            }
        });

        response.on("error", function(error) {
            callback(error, null);
        });
    });

    req.on("error", function(error) {
        callback(error, null);
    });

    req.end(requestBody);
}
/**
 * @callback global~api(callback)
 * @param err {Error} - {@link null} or an object describing an exception that occured during execution
 * @param response {Object} - depending on the call different return types refer to the interacting classes documented under {@link Repository}
 */
module.exports = api;
