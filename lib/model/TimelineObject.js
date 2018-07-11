"use strict";

var log = require("../util/log");
var api = require("../util/api-json");

/**
 * @class TimelineObject
 * @desc
 * TimelineObject are elements in the Repository that correspond to a set of properties and a
 * blob (binary or string) of {@link SeedData}. This class will allow you to interact with
 * TimelineObject and search for them
 */

/**
 * @constructor TimelineObject
 *
 * @param {string} serviceUrl - API endpoint URL
 */
function TimelineObject(serviceUrl) {
    this.endpoint = serviceUrl  + "/mpulse/api/timeline/v1";
}

/**
 * Creates a new object in the repository database
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {TimelineObject} props - A POJO describing object properties
 * @param {function} callback -
 * [A callback called after the API request was finalized]{@link TimelineObject~createTimelineObject(callback)}
 */
TimelineObject.prototype.createTimelineObject = function(token, props, callback) {
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
 * @callback TimelineObject~createTimelineObject(callback)
 * @param {?Error} err - {@link null} or an object describing an exception that occured during execution
 * @param {?string} id - the ID assigned to the object after being inserted into the repository
 * @desc
 * Called after a new object has been added to the repository
 */

/**
 * Retrieve an TimelineObject from the repository database by its type and ID
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} id - ID of the Object to retrieve from the repository
 * @param {function} callback -
 * [A callback function called after the API request was finalized]
 * {@link TimelineObject~getTimelineObjectByID(callback)}
 */
TimelineObject.prototype.getTimelineObjectByID = function(token, id, callback) {
    log.debug("getObjectByID(token=" + token + ", id=" + id + ")");

    var objectURL = this.getObjectURL(id);
    api(token, objectURL, "GET", null, null, callback);
};
/**
 * @callback TimelineObject~getObjectByID(callback)
 *
 * @param {?Error} err - {@link null} or an object describing an exception that occured during execution
 * @param {?(String|Object)} responseBody - the body of the response, either a POJO from the JSON response
 * or String with the textual data
 *
 * @desc
 * Called after retrieving an object from the API
 */

/**
 * Find all TimelineObject matching {@link query} of a {@link type} in the repository
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {(Object|function|String[])} query - Filter attributes to apply to repository search
 * @param {function} callback -
 * [A callback function called after the API request was finalized]
 * {@link TimelineObject~getTimelineObjectsList(callback)}
 */
TimelineObject.prototype.getTimelineObjectsList = function(token, query, callback) {
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
 * @callback TimelineObject~getTimelineObjectsList(callback)
 *
 * @param {?Error} err - {@link null} or an object describing an exception that occured during execution
 * @param {?TimelineObject[]} responseBody - A collection of TimelineObject matching
 * the queried repository type TimelineObject
 *
 * @desc
 * Called once response has been retrieved for the query
 */

/**
 * Remove a timeline object from the repository
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} id - the id of the object to remove
 * @param {function} callback -
 * [A callback function called after the API request was finalized]{@link TimelineObject~deleteTimelineObject(callback)}
 */
TimelineObject.prototype.deleteTimelineObject = function(token, id, callback) {
    log.debug("deleteTimelineObject(token=" + token + ",  id=" + id + ")");

    var objectURL = this.getObjectURL(id);
    api(token, objectURL, "DELETE", null, null, callback);
};
/**
 * @callback TimelineObject~deleteTimelineObject(callback)
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
TimelineObject.prototype.getObjectURL = function(id) {
    return this.endpoint + "/" + id;
};

module.exports = TimelineObject;
