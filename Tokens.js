var debug_log = require("./debug_log.js");

function Tokens(service_url) {
	this.endpoint = service_url + "/Tokens";
}

Tokens.prototype.connect = function(tenant_name, user_name, password, callback) {
	debug_log("connect(tenant_name=" + tenant_name + ", user_name=" + user_name + ", password=" + password + ")");

	if (callback) {
		callback();
	}
};

Tokens.prototype.disconnect = function(callback) {
	debug_log("disconnect()");

	if (callback) {
		callback();
	}
};

module.exports = Tokens;
