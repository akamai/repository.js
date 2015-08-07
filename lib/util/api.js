"use strict";

var log = require("./log");

var url = require("url");
var http = require("http");
var https = require("https");

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

module.exports = api;
