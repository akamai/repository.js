var debug_log = require("./debug_log.js");

function Objects(service_url) {
	this.endpoint = service_url + "/Objects";
}

Objects.prototype.create_object = function(token, props, callback) {
	debug_log("create_object(token=" + token + ", props=" + JSON.stringify(props) + ")");

	if (callback) {
		callback();
	}
}

Objects.prototype.get_object_by_id = function(token, type, id, callback) {
	debug_log("get_object_by_id(token=" + token + ", type=" + type + ", id=" + id + ")");

	if (callback) {
		callback();
	}
}

Objects.prototype.query_objects = function(token, type, query, callback) {
	debug_log("query_objects(token=" + token + ", type=" + type + ", query=" + JSON.stringify(query) + ")");

	if (callback) {
		callback();
	}
}

Objects.prototype.update_object = function(token, type, id, props, callback) {
	debug_log("update_object(token=" + token + ", type=" + type + ", id=" + id + ", props=" + JSON.stringify(props) + ")");

	if (callback) {
		callback();
	}
}

Objects.prototype.delete_object = function(token, type, id, callback) {
	debug_log("delete_object(token=" + token + ", type=" + type + ", id=" + id + ")");

	if (callback) {
		callback();
	}
}

module.exports = Objects;
