var debug_log = require("./debug_log.js");

function SeedData(service_url) {
	this.endpoint = service_url + "/SeedData";
}

SeedData.prototype.read_seed_data = function(token, id, callback) {
	debug_log("read_seed_data(token=" + token + ", id=" + id + ")");

	if (callback) {
		callback();
	}
};

SeedData.prototype.append_seed_data = function(token, id, content, callback) {
	debug_log("append_seed_data(token=" + token + ", id=" + id + ", content=" + content + ")");

	if (callback) {
		callback();
	}
};

SeedData.prototype.truncate_seed_data = function(token, id, callback) {
	debug_log("truncate_seed_data(token=" + token + ", id=" + id + ")");

	if (callback) {
		callback();
	}
};

module.exports = SeedData;
