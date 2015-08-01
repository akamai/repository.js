var debug_log = require("./debug_log.js");

function Objects(service_url) {
	this.endpoint = service_url + "/Objects";
}

Objects.prototype.createObject = function(token, props, callback) {
	debug_log("createObject(token=" + token + ", props=" + JSON.stringify(props) + ")");

	if (callback) {
		callback();
	}
}

Objects.prototype.getObjectByID = function(token, type, id, callback) {
	debug_log("getObjectByID(token=" + token + ", type=" + type + ", id=" + id + ")");

	if (callback) {
		callback();
	}
}

Objects.prototype.queryObjects = function(token, type, query, callback) {
	debug_log("queryObjects(token=" + token + ", type=" + type + ", query=" + JSON.stringify(query) + ")");

	if (callback) {
		callback();
	}
}

Objects.prototype.updateObject = function(token, type, id, props, callback) {
	debug_log("updateObject(token=" + token + ", type=" + type + ", id=" + id + ", props=" + JSON.stringify(props) + ")");

	if (callback) {
		callback();
	}
}

Objects.prototype.deleteObject = function(token, type, id, callback) {
	debug_log("deleteObject(token=" + token + ", type=" + type + ", id=" + id + ")");

	if (callback) {
		callback();
	}
}

module.exports = Objects;
