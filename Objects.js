var debug_log = require("./debug_log.js");
var api_request = require("./api_request.js");

function Objects(service_url) {
	this.endpoint = service_url + "/Objects";
}

Objects.prototype.createObject = function(token, props, callback) {
	debug_log("createObject(token=" + token + ", props=" + JSON.stringify(props) + ")");

	api_request(token, this.endpoint, "PUT", props, function(error, responseBody) {
		if (error) {
			// Request failed.
			callback(error, null);
		} else {
			// Success!
			// Extract the newly-created object's ID and send it on.
			callback(null, responseBody.id);
		}
	});
}

Objects.prototype.getObjectByID = function(token, type, id, callback) {
	debug_log("getObjectByID(token=" + token + ", type=" + type + ", id=" + id + ")");

	var objectURL = this.endpoint + "/" + type + "/" + id;
	api_request(token, objectURL, "GET", null, callback);
}

Objects.prototype.queryObjects = function(token, type, query, callback) {
	debug_log("queryObjects(token=" + token + ", type=" + type + ", query=" + JSON.stringify(query) + ")");

	var queryURL = this.endpoint + "/" + type + "/";

	var firstParam = true;
	for (var name in query) {
		if (firstParam) {
			queryURL += "?";
			firstParam = false;
		} else {
			queryURL += "&";
		}
		var value = query[name];
		queryURL += name + "=" + encodeURIComponent(value);
	}

	api_request(token, queryURL, "GET", null, callback);
}

Objects.prototype.updateObject = function(token, type, id, props, callback) {
	debug_log("updateObject(token=" + token + ", type=" + type + ", id=" + id + ", props=" + JSON.stringify(props) + ")");

	var objectURL = this.endpoint + "/" + type + "/" + id;
	api_request(token, objectURL, "POST", props, callback);
}

Objects.prototype.deleteObject = function(token, type, id, callback) {
	debug_log("deleteObject(token=" + token + ", type=" + type + ", id=" + id + ")");

	var objectURL = this.endpoint + "/" + type + "/" + id;
	api_request(token, objectURL, "DELETE", null, callback);
}

module.exports = Objects;
