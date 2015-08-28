"use strict";

var log = require("../util/log");
var api = require("../util/api");

/**
 * @class Objects
 * @desc
 * Objects are elements in the Repository that correspond to a set of properties and a blob of {@link SeedData}
 * This class will allow you to interact with objects and search for them
 */

/**
 * @constructor Objects
 *
 * @param serviceUrl {String} - API endpoint URL
 * @return {Objects} New instance of the Objects class
 */
function Objects(serviceUrl) {
    this.endpoint = serviceUrl + "/Objects";
}

/**
 * creates a new object in the repository database
 *
 * @param token {String} - API-Auth token retrieved with {@link Tokens}
 * @param props {Object} - A POJO describing object properties
 * @param {Objects~createObject(callback)} callback - A callback called after the API request was finalized
 */
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
/**
 * @callback Objects~createObject(callback)
 *
 * @param err {Error} - {@link null} or an object describing an exception that occured during execution
 * @param id {String} - the ID assigned to the object after being inserted into the repository
 *
 * @desc
 * Called after a new object has been added to the repository
 */

/**
 * Retrieve an Object from the repository database by its type and ID
 * @param token {String} - API-Auth token retrieved with {@link Tokens}
 * @param type {String} - A String describing the type of object to request
 * @param id {String} - ID of the Object to retrieve from the repository
 * @param {Objects~getObjectByID(callback)} callback - A callback function called after the API request was finalized
 */
Objects.prototype.getObjectByID = function(token, type, id, callback) {
    log.debug("getObjectByID(token=" + token + ", type=" + type + ", id=" + id + ")");

    var objectURL = this.getObjectURL(type, id);
    api(token, objectURL, "GET", null, callback);
};
/**
 * @callback Objects~getObjectByID(callback)
 *
 * @param err {Error} - {@link null} or an object describing an exception that occured during execution
 * @param responseBody {Object} - the requested object, in POJO form
 *
 * @desc
 * Called after retrieving an object from the API
 */

/**
 * Find all objects matching {@link query} of a {@link type} in the repository
 *
 * @param token {String} - API-Auth token retrieved with {@link Tokens}
 * @param type {String} - Type of repository object to search for
 * @param query {Object} - POJO describing attributes to search for in the collection of repository objects
 * @param {Objects~queryObjects(callback)} callback - A callback function called after the API request was finalized
 */
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
/**
 * @callback Objects~queryObjects(callback)
 *
 * @param err {Error} - {@link null} or an object describing an exception that occured during execution
 * @param responseBody {Object[]} - A collection of objects matching the queried repository type objects
 *
 * @desc
 * Called once response has been retrieved for the query
 */

/**
 * Update an object based on its ID in the repository
 *
 * @param token {String} - API-Auth token retrieved with {@link Tokens}
 * @param type {String} - Type of repository object to replace
 * @param id {String} - the id of the object to update
 * @param props {Object} - new properties for the object in the repository
 * @param {Objects~updateObject(callback)} callback - A callback function called after the API request was finalized
 */
Objects.prototype.updateObject = function(token, type, id, props, callback) {
    log.debug("updateObject(token=" + token + ", type=" + type + ", id=" +
        id + ", props=" + JSON.stringify(props) + ")");

    var objectURL = this.getObjectURL(type, id);
    api(token, objectURL, "POST", props, callback);
};
/**
 * @callback Objects~updateObject(callback)
 *
 * @param err {Error} - {@link null} or an object describing an exception that occured during execution
 * @param responseBody {Object} - A new object returned from the repository with the new properties
 *
 * @desc
 * Called once response has been retrieved for the query
 */

/**
 * Remove an object from the repository
 *
 * @param token {String} - API-Auth token retrieved with {@link Tokens}
 * @param type {String} - Type of repository object to remove
 * @param id {String} - the id of the object to remove
 * @param {Objects~deleteObject(callback)} callback - A callback function called after the API request was finalized
 */
Objects.prototype.deleteObject = function(token, type, id, callback) {
    log.debug("deleteObject(token=" + token + ", type=" + type + ", id=" + id + ")");

    var objectURL = this.getObjectURL(type, id);
    api(token, objectURL, "DELETE", null, callback);
};
/**
 * @callback Objects~deleteObject(callback)
 *
 * @param err {Error} - {@link null} or an object describing an exception that occured during execution
 * @param responseBody {String} - empty String
 *
 * @desc
 * Called once response has been reached
 */

/**
 * Build a URL out of the ID and Type of an object
 *
 * @param {String} type - Type of Object to access
 * @param {String} id - ID of the Object
 *
 * @returns {String} URL referring to an Object in the repository
 */
Objects.prototype.getObjectURL = function(type, id) {
    return this.endpoint + "/" + type + "/" + id;
};

module.exports = Objects;
