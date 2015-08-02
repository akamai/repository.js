var debug_log = require("./debug_log.js");
var api_request = require("./api_request.js");

function SeedData(service_url) {
	this.endpoint = service_url + "/SeedData";
}

SeedData.prototype.readSeedData = function(token, id, callback) {
	debug_log("readSeedData(token=" + token + ", id=" + id + ")");

	var seedDataURL = this.endpoint + "/" + id;
	api_request(token, seedDataURL, "GET", null, callback);
};

SeedData.prototype.appendSeedData = function(token, id, content, callback) {
	debug_log("appendSeedData(token=" + token + ", id=" + id + ", content=" + content + ")");

	var seedDataURL = this.endpoint + "/" + id;
	api_request(token, seedDataURL, "POST", content, callback);
};

SeedData.prototype.truncateSeedData = function(token, id, callback) {
	debug_log("truncateSeedData(token=" + token + ", id=" + id + ")");

	var seedDataURL = this.endpoint + "/" + id;
	api_request(token, seedDataURL, "DELETE", null, callback);
};

module.exports = SeedData;
