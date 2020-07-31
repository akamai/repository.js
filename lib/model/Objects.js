"use strict";

var log = require("../util/log");
var api = require("../util/api-json");

/**
 * @class Objects
 * @desc
 * Objects are elements in the Repository that correspond to a set of properties and a
 * blob (binary or string) of {@link SeedData}. This class will allow you to interact with
 * objects and search for them
 */

/**
 * @constructor Objects
 *
 * @param {string} serviceUrl - API endpoint URL
 * @param {string} sourceType - source of the original call 
 */
function Objects(serviceUrl, sourceType) {
    this.endpoint = serviceUrl +
        (serviceUrl.indexOf("/services/rest/RepositoryService/v1") != -1 ?
            "/Objects" :
            "/services/rest/RepositoryService/v1/Objects");
    this.source = sourceType;
}

/**
 * Creates a new object in the repository database
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {Object} props - A POJO describing object properties
 * @param {function} callback -
 * [A callback called after the API request was finalized]{@link Objects~createObject(callback)}
 */
Objects.prototype.createObject = function(token, props, callback) {
    log.debug("createObject(token=" + token + ", props=" + JSON.stringify(props) + ")");

    api(token, this.endpoint, "PUT", props, this.source, function(error, responseBody) {
        if (error) {
            // Request failed.
            callback(error, null);
        } else {
            // Success!

            // Response JSON will look like:
            // { "id": 42 }

            // Extract the ID and return that in the callback.
            callback(undefined, responseBody.id);
        }
    });
};
/**
 * @callback Objects~createObject(callback)
 * @param {?Error} err - {@link null} or an object describing an exception that occured during execution
 * @param {?string} id - the ID assigned to the object after being inserted into the repository
 * @desc
 * Called after a new object has been added to the repository
 */

/**
 * Retrieve an Object from the repository database by its type and ID
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} type - A String describing the type of object to request
 * @param {string} id - ID of the Object to retrieve from the repository
 * @param {function} callback -
 * [A callback function called after the API request was finalized]{@link Objects~getObjectByID(callback)}
 */
Objects.prototype.getObjectByID = function(token, type, id, callback) {
    log.debug("getObjectByID(token=" + token + ", type=" + type + ", id=" + id + ")");

    var objectURL = this.getObjectURL(type, id);
    api(token, objectURL, "GET", null, this.source, callback);
};
/**
 * @callback Objects~getObjectByID(callback)
 *
 * @param {?Error} err - {@link null} or an object describing an exception that occured during execution
 * @param {?(String|Object)} responseBody - the body of the response, either a POJO from the JSON response
 * or String with the textual data
 *
 * @desc
 * Called after retrieving an object from the API
 */

/**
 * Checks for the existance in the repository of the object at ID
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} type - Type of repository object to search for
 * @param {number} id - ID of the object to check if it exists
 * @param {function} callback -
 * [Called after the API request was finalized]{@link Objects~objectExists(callback)}
 */
Objects.prototype.objectExists = function(token, type, id, callback) {
    log.debug("objectExists(token=" + token + "), type=" + type + ", id=" + id +")");

    var objectURL = this.getObjectURL(type, id);
    var wrapper = function(err, result) {
        callback(err, (typeof result !== "undefined"));
    }

    api(token, objectURL, "HEAD", null, this.source, wrapper);
};
/**
 * @callback Objects~objectExists(callback)
 *
 * @param {?Error} err - {@link null} or an object describing an exception that occured during execution
 * @param {boolean} exists - True if the repository object exists
 *
 * @desc
 * Called after an existance check has returned with a result
 */

/**
 * Find all objects matching {@link query} of a {@link type} in the repository
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} type - Type of repository object to search for
 * @param {(Object|function|String[])} query - Filter attributes to apply to repository search
 * @param {bool} includeDetails - Flag if or if not to return full object from query
 * @param {function} callback -
 * [A callback function called after the API request was finalized]{@link Objects~queryObjects(callback)}
 */
Objects.prototype.queryObjects = function(token, type, query, includeDetails, callback) {
    log.debug("queryObjects(token=" + token + ", type=" + type + ", query=" + JSON.stringify(query) + ")");

    if (!callback && typeof includeDetails === "function") {
        callback = includeDetails;
        includeDetails = null;
    }

    var queryURL = this.endpoint + "/" + type + "/";
    var firstParam = true;

    if (typeof query === "object") {
        if (Object.prototype.toString.call(query) === "[object Array]") {
            if (query.length > 0) {
                queryURL += "?" + query.join("&");
                firstParam = false;
            }
        } else {
            for (var name in query) {
                if (query.hasOwnProperty(name)) {
                    if (firstParam) {
                        queryURL += "?";
                        firstParam = false;
                    } else {
                        queryURL += "&";
                    }

                    var value = query[name];
                    queryURL += name + "=" + encodeURIComponent(value);
                }
            }
        }
    } else if (typeof query === "function") {
        var additionalParams = "";
        try {
            // keep firstparam true if additionalParams was empty string
            additionalParams += query();
            firstParam = additionalParams.length > 0 ? false : true;
        } catch (error) {}
        queryURL += additionalParams;
    } else if (typeof query === "string") {
        queryURL += (firstParam ? "?" : "&") + query;
        firstParam = false;
    }

    if (typeof includeDetails === "boolean" && includeDetails === false) {
        queryURL += (firstParam ? "?" : "&") + "includeDetails=false";
    }

    api(token, queryURL, "GET", null, this.source, callback);
};
/**
 * @callback Objects~queryObjects(callback)
 *
 * @param {?Error} err - {@link null} or an object describing an exception that occured during execution
 * @param {?Object[]} responseBody - A collection of objects matching the queried repository type objects
 *
 * @desc
 * Called once response has been retrieved for the query
 */

/**
 * Update an object based on its ID in the repository
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} type - Type of repository object to replace
 * @param {string} id - the id of the object to update
 * @param {Object} props - new properties for the object in the repository
 * @param {function} callback -
 * [A callback function called after the API request was finalized]{@link Objects~updateObject(callback)}
 */
Objects.prototype.updateObject = function(token, type, id, props, callback) {
    log.debug("updateObject(token=" + token + ", type=" + type + ", id=" +
        id + ", props=" + JSON.stringify(props) + ")");

    var objectURL = this.getObjectURL(type, id);
    api(token, objectURL, "POST", props, this.source, callback);
};
/**
 * @callback Objects~updateObject(callback)
 *
 * @param {?Error} err - {@link null} or an object describing an exception that occured during execution
 * @param {?Object} responseBody - A new object returned from the repository with the new properties
 *
 * @desc
 * Called once response has been retrieved for the query
 */

/**
 * Remove an object from the repository
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} type - Type of repository object to remove
 * @param {string} id - the id of the object to remove
 * @param {function} callback -
 * [A callback function called after the API request was finalized]{@link Objects~deleteObject(callback)}
 */
Objects.prototype.deleteObject = function(token, type, id, callback) {
    log.debug("deleteObject(token=" + token + ", type=" + type + ", id=" + id + ")");

    var objectURL = this.getObjectURL(type, id);
    api(token, objectURL, "DELETE", null, this.source, callback);
};
/**
 * @callback Objects~deleteObject(callback)
 *
 * @param {?Error} err - {@link null} or an object describing an exception that occured during execution
 * @param {?string} responseBody - empty String
 *
 * @desc
 * Called once response has been reached
 */

 /**
 * duplicate an object based on its ID in the repository
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} type - Type of repository object to duplicate
 * @param {string} id - the id of the object to duplicate
 * @param {Object} props - new properties for the object in the repository
 * @param {function} callback -
 * [A callback function called after the API request was finalized]{@link Objects~duplicateObject(callback)}
 */
Objects.prototype.duplicateObject = function(token, type, id, props, callback) {
    log.debug("duplicateObject(token=" + token + ", type=" + type + ", id=" +
        id + ", props=" + JSON.stringify(props) + ")");

    var objectURL = this.getObjectURL(type, id) + "/duplicate";
    api(token, objectURL, "POST", props, this.source, callback);
};
/**
 * @callback Objects~duplicateObject(callback)
 *
 * @param {?Error} err - {@link null} or an object describing an exception that occured during execution
 * @param {?Object} responseBody - A new object returned from the repository with the new properties
 *
 * @desc
 * Called once response has been retrieved for the query
 */

/**
 * Build a URL out of the ID and Type of an object
 *
 * @param {string} type - Type of Object to access
 * @param {string} id - ID of the Object
 *
 * @returns {String} URL referring to an Object in the repository
 */
Objects.prototype.getObjectURL = function(type, id) {
    return this.endpoint + "/" + type + "/" + id;
};

module.exports = Objects;
