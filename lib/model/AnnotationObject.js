"use strict";

var log = require("../util/log");
var api = require("../util/api-json");

/**
 * @class AnnotationObject
 * @desc
 * AnnotationObject are elements in the Repository that correspond to a set of properties and a
 * blob (binary or string) of {@link SeedData}. This class will allow you to interact with
 * AnnotationObject and search for them
 */

/**
 * @constructor AnnotationObject
 *
 * @param {string} serviceUrl - API endpoint URL
 */
function AnnotationObject(serviceUrl) {
    this.endpoint = serviceUrl + "/mpulse/api/annotations/v1";
}

/**
 * Creates a new object in the repository database
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {AnnotationObject} props - A POJO describing object properties
 * @param {function} callback -
 * [A callback called after the API request was finalized]{@link AnnotationObject~createAnnotationObject(callback)}
 */
AnnotationObject.prototype.createAnnotationObject = function(token, props, callback) {
    log.debug("createObject(token=" + token + ", props=" + JSON.stringify(props) + ")");

    api(token, this.endpoint, "POST", props, null, function(error, responseBody) {
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
 * @callback AnnotationObject~createAnnotationObject(callback)
 * @param {?Error} err - {@link null} or an object describing an exception that occured during execution
 * @param {?string} id - the ID assigned to the object after being inserted into the repository
 * @desc
 * Called after a new object has been added to the repository
 */
/**
 * Checks for the existance in the repository of the object at ID
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {number} id - ID of the object to check if it exists
 * @param {function} callback -
 * [Called after the API request was finalized]{@link AnnotationObject~annotationObjectExists(callback)}
 */
AnnotationObject.prototype.annotationObjectExists = function(token, id, callback) {
    log.debug("objectExists(token=" + token + "),  id=" + id +")");

    var objectURL = this.getObjectURL(id);
    var wrapper = function(err, result) {
        callback(err, (typeof result !== "undefined"));
    }

    api(token, objectURL, "HEAD", null, null, wrapper);
};
/**
 * @callback AnnotationObject~annotationObjectExists(callback)
 *
 * @param {?Error} err - {@link null} or an object describing an exception that occured during execution
 * @param {boolean} exists - True if the repository object exists
 *
 * @desc
 * Called after an existance check has returned with a result
 */
/**
 * Retrieve an AnnotationObject from the repository database by its type and ID
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} id - ID of the Object to retrieve from the repository
 * @param {function} callback -
 * [A callback function called after the API request was finalized]
 * {@link AnnotationObject~getAnnotationObjectByID(callback)}
 */
AnnotationObject.prototype.getAnnotationObjectByID = function(token, id, callback) {
    log.debug("getObjectByID(token=" + token + ", id=" + id + ")");

    var objectURL = this.getObjectURL(id);
    api(token, objectURL, "GET", null, null, callback);
};
/**
 * @callback AnnotationObject~getObjectByID(callback)
 *
 * @param {?Error} err - {@link null} or an object describing an exception that occurred during execution
 * @param {?(String|Object)} responseBody - the body of the response, either a POJO from the JSON response
 * or String with the textual data
 *
 * @desc
 * Called after retrieving an object from the API
 */

/**
 * Update an annotation based on its ID in the repository
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} id - the id of the object to update
 * @param {Object} props - new properties for the object in the repository
 * @param {function} callback -
 * [A callback function called after the API request was finalized]{@link AnnotationObject~updateAnnotation(callback)}
 */
AnnotationObject.prototype.updateAnnotation = function(token, id, props, callback) {
    log.debug("updateObject(token=" + token + ", id=" +
        id + ", props=" + JSON.stringify(props) + ")");

    var objectURL = this.getObjectURL(id);
    api(token, objectURL, "PUT", props, null, callback);
};
/**
 * @callback AnnotationObject~updateAnnotation(callback)
 *
 * @param {?Error} err - {@link null} or an object describing an exception that occurred during execution
 * @param {?Object} responseBody - A new object returned from the repository with the new properties
 *
 * @desc
 * Called once response has been retrieved for the query
 */
/**
 * Find all AnnotationObject matching {@link query} of a {@link type} in the repository
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {(Object|function|String[])} query - Filter attributes to apply to repository search
 * @param {function} callback -
 * [A callback function called after the API request was finalized]
 * {@link AnnotationObject~getAnnotationObjectsList(callback)}
 */
AnnotationObject.prototype.getAnnotationObjectsList = function(token, query, callback) {
    log.debug("queryObjects(token=" + token + ",  query=" + JSON.stringify(query) + ")");

    if (!callback && typeof includeDetails === "function") {
        callback = includeDetails;
        includeDetails = null;
    }

    var queryURL = this.endpoint;
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

    api(token, queryURL, "GET", null, null, callback);
};
/**
 * @callback AnnotationObject~getAnnotationObjectsList(callback)
 *
 * @param {?Error} err - {@link null} or an object describing an exception that occured during execution
 * @param {?AnnotationObject[]} responseBody - A collection of AnnotationObject
 * matching the queried repository type AnnotationObject
 *
 * @desc
 * Called once response has been retrieved for the query
 */

/**
 * Remove an object from the repository
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} id - the id of the object to remove
 * @param {function} callback -
 * [A callback function called after the API request was finalized]{@link AnnotationObject~deleteObject(callback)}
 */
AnnotationObject.prototype.deleteAnnotationObject = function(token, id, callback) {
    log.debug("deleteAnnotationObject(token=" + token + ",  id=" + id + ")");

    var objectURL = this.getObjectURL(id);
    api(token, objectURL, "DELETE", null, null, callback);
};
/**
 * @callback AnnotationObject~deleteAnnotationObject(callback)
 *
 * @param {?Error} err - {@link null} or an object describing an exception that occurred during execution
 * @param {?string} responseBody - empty String
 *
 * @desc
 * Called once response has been reached
 */

/**
 * Build a URL out of the ID and Type of an object
 *
 * @param {string} id - ID of the Object
 *
 * @returns {String} URL referring to an Object in the repository
 */
AnnotationObject.prototype.getObjectURL = function(id) {
    return this.endpoint + "/" + id;
};

module.exports = AnnotationObject;
