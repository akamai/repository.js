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
			// Extract the token and send it on.
			callback(null, responseBody.token);
		}
	});
};

Tokens.prototype.disconnect = function(token, callback) {
	debug_log("disconnect()");

	api_request(null, this.endpoint + "/" + token, "DELETE", null, callback);
};

module.exports = Tokens;
