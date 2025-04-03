"use strict";

var log = require("./log");
var APIError = require("../errors/APIError.js");

var url = require("url");
var http = require("http");
var https = require("https");

/**
 * @namespace Util
 * @function api
 *
 * @desc
 * Wrapper function querying the API via HTTP and parsing the response to a JSON object
 *
 * @param {string} token - API-Auth token
 * @param {string} endpoint - URL to the API endpoint
 * @param {string} method - HTTP Method use with the API call
 * @param {?string} requestBody - A string of HTTP request body content if we choose to POST to the API
 * @param {?string} source - source of the original call (i.e. script or cli)
 * @param {function} callback -
 * [A callback called after the API request was finalized]{@link api~api(callback)}
 */
function api(token, endpoint, method, requestBody, source, callback) {
    log.debug("sendRequest(endpoint=" + endpoint + ", method=" + method + ", requestBody=" + requestBody + ")");

    if (typeof source === "function") {
        callback = source;
        source = undefined;
    }

    if (requestBody !== null && typeof requestBody === "object") {
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

    if (source) {
        headers["x-source"] = source;
    }

    var options = url.parse(endpoint);
    options.method = method;
    options.headers = headers;

    var protocol = options.protocol === "http:" ? http : https;

    var responseBody = "";

    var req = protocol.request(options, function(response) {
        response.on("data", function(chunk) {
            log.debug("Got response data: " + chunk);

            responseBody += chunk;
        });

        response.on("end", function() {
            var responseCode = response.statusCode;
            log.debug("Got response code: " + responseCode + ", response body: " + responseBody);

            if (callback) {
                var error;

                if (responseBody.trim().length === 0) {
                    responseBody = null;
                } else {
                    try {
                        responseBody = JSON.parse(responseBody);
                    } catch (e) {
                        error = new APIError(e.message ? e.message : e, responseBody, responseCode);
                    }
                }

                // Consider anything in the 200-299 range to be success.
                if (!error && (responseCode < 200 || responseCode >= 300)) {
                    // Request failed.
                    error = new APIError(response.statusMessage, responseBody, responseCode);
                }

                callback(error, responseBody, responseCode);
            }
        });

        response.on("error", function(error) {
            log.debug("Got response error: " + error);

            callback && callback(error);
        });
    });

    req.on("error", function(error) {
        log.debug("Got request error: " + error);

        callback && callback(error);
    });

    req.end(requestBody);
}
/**
 * @callback api~api(callback)
 * @param {?(APIError|Error)} err - {@link null} or an object describing an exception that occured during execution
 * @param {?(Object|string)} response - depending on the call different return types refer to the interacting
 * classes documented under {@link Repository}
 */

module.exports = api;
