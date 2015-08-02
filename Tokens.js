var debug_log = require("./debug_log.js");
var api_request = require("./api_request.js");

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

	api_request(null, this.endpoint, "PUT", credentials, function(error, responseBody) {
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
	debug_log("disconnect()");

	var tokenURL = this.endpoint + "/" + token;
	api_request(null, tokenURL, "DELETE", null, callback);
};

module.exports = Tokens;
