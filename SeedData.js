var debug_log = require("./debug_log.js");

function SeedData(service_url) {
	this.endpoint = service_url + "/SeedData";
}

SeedData.prototype.readSeedData = function(token, id, callback) {
	debug_log("readSeedData(token=" + token + ", id=" + id + ")");

	if (callback) {
		callback();
	}
};

SeedData.prototype.appendSeedData = function(token, id, content, callback) {
	debug_log("appendSeedData(token=" + token + ", id=" + id + ", content=" + content + ")");

	if (callback) {
		callback();
	}
};

SeedData.prototype.truncateSeedData = function(token, id, callback) {
	debug_log("truncateSeedData(token=" + token + ", id=" + id + ")");

	if (callback) {
		callback();
	}
};

module.exports = SeedData;
