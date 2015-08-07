"use strict";

var log = require("../util/log");
var api = require("../util/api");

function Objects(serviceUrl) {
    this.endpoint = serviceUrl + "/Objects";
}

Objects.prototype.createObject = function(token, props, callback) {
    log.debug("createObject(token=" + token + ", props=" + JSON.stringify(props) + ")");

    api(token, this.endpoint, "PUT", props, function(error, responseBody) {
        if (error) {
            // Request failed.
            callback(error, null);
        } else {
            // Success!

            // Response JSON will look like:
            // { "id": 42 }

                        // Extract the ID and return that in the callback.
            callback(null, responseBody.id);
        }
    });
};

Objects.prototype.getObjectByID = function(token, type, id, callback) {
    log.debug("getObjectByID(token=" + token + ", type=" + type + ", id=" + id + ")");

    var objectURL = this.getObjectURL(type, id);
    api(token, objectURL, "GET", null, callback);
};

Objects.prototype.queryObjects = function(token, type, query, callback) {
    log.debug("queryObjects(token=" + token + ", type=" + type + ", query=" + JSON.stringify(query) + ")");

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

    api(token, queryURL, "GET", null, callback);
};

Objects.prototype.updateObject = function(token, type, id, props, callback) {
    log.debug("updateObject(token=" + token + ", type=" + type + ", id=" +
        id + ", props=" + JSON.stringify(props) + ")");

    var objectURL = this.getObjectURL(type, id);
    api(token, objectURL, "POST", props, callback);
};

Objects.prototype.deleteObject = function(token, type, id, callback) {
    log.debug("deleteObject(token=" + token + ", type=" + type + ", id=" + id + ")");

    var objectURL = this.getObjectURL(type, id);
    api(token, objectURL, "DELETE", null, callback);
};

Objects.prototype.getObjectURL = function(type, id) {
    return this.endpoint + "/" + type + "/" + id;
};

module.exports = Objects;