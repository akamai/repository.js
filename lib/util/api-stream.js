"use strict";

var log = require("./log");

var url = require("url");
var http = require("http");
var https = require("https");

function stream_request(token, endpoint, method, requestReader, responseWriter, callback) {
    log.debug("sendRequest(endpoint=" + endpoint + ", method=" + method + ", requestReader=" + requestReader + ")");

    var headers = {
        "Connection": "close"
    };

    if (token) {
        headers["X-Auth-Token"] = token;
    }

    var options = url.parse(endpoint);
    options.method = method;
    options.headers = headers;

    var protocol = options.protocol === "http:" ? http : https;

    var req = protocol.request(options, function(response) {
        if (responseWriter) {
            response.pipe(responseWriter);
        } else {
            response.on("data", function(chunk) {
                // No need to do anything with the content, we're just attaching an event handler to keep the data flowing.
            });
        }

        response.on("end", function () {
            var responseCode = response.statusCode;
            log.debug("Got response code: " + responseCode);

            if (callback) {
                // Consider anything in the 200-299 range to be success.
                var error = null;
                if (responseCode < 200 || responseCode >= 300) {
                    // Request failed.
                    error = {
                        code: responseCode,
                        message: response.statusMessage
                    };
                }

                callback(error);
            }
        });

        if (callback) {
            response.on("error", callback);
        }
    });

    if (callback) {
        req.on("error", callback);
    }

    if (typeof requestReader === "string") {
        // If it's a raw string, just send it.
        req.end(requestReader);
    } else {
        // Otherwise, assume it's a Stream implementation.
        requestReader.pipe(req);
    }
}

module.exports = stream_request;
