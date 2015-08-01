var debug_log = require("./debug_log.js");

var url = require("url");
var http = require("http");

function Tokens(service_url) {
	this.endpoint = service_url + "/Tokens";
}

Tokens.prototype.connect = function(tenant_name, user_name, password, callback) {
	debug_log("connect(tenant_name=" + tenant_name + ", user_name=" + user_name + ", password=" + password + ")");

	var credentials = {
		userName: user_name,
		password: password
	};

	if (tenant_name) {
		credentials.tenant = tenant_name;
	}

	sendRequest(null, this.endpoint, "PUT", credentials, function(error, responseBody) {
		if (error) {
			// Request failed.
			callback(error, null);
		} else {
			// Success!
			// Extract the token and send it on.
			callback(null, responseBody.token);
		}
	});
};

Tokens.prototype.disconnect = function(token, callback) {
	debug_log("disconnect()");

	sendRequest(null, this.endpoint + "/" + token, "DELETE", null, callback);
};

function sendRequest(token, endpoint, method, requestBody, callback) {
	debug_log("sendRequest(endpoint=" + endpoint + ", method=" + method + ", requestBody=" + requestBody + ")");

	if (typeof requestBody === "object") {
		requestBody = JSON.stringify(requestBody);
		debug_log("Serialized requestBody to: " + requestBody);
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

	var responseBody = "";

	var req = http.request(options, function(response) {
		response.on('data', function (chunk) {
			responseBody += chunk;
		});

		response.on('end', function () {
			var responseCode = response.statusCode;
			debug_log("Got response code: " + responseCode + ", response body: " + responseBody);

			if (callback) {
				if (responseBody.trim().length == 0) {
					responseBody = null;
				} else {
					responseBody = JSON.parse(responseBody);
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

		response.on('error', console.log);
	});

	req.on('error', function(e) {
		callback(e, null);
	});

	req.end(requestBody);
}

module.exports = Tokens;
