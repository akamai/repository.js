"use strict";

var log = require("../util/log");
var api = require("../util/api-json");

/**
 * @class Annotation
 * @desc
 * Annotation are elements in the Repository that correspond to a set of properties and a
 * blob (binary or string) of {@link SeedData}. This class will allow you to interact with
 * Annotation and search for them
 */

/**
 * @constructor Annotation
 *
 * @param {string} serviceUrl - API endpoint URL
 */
function Annotation(serviceUrl) {
    this.endpoint = serviceUrl;
}

/**
 * Creates a new object in the repository database
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {Annotation} props - A POJO describing object properties
 * @param {function} callback -
 * [A callback called after the API request was finalized]{@link Annotation~createAnnotationObject(callback)}
 */
Annotation.prototype.createAnnotationObject = function(token, props, callback) {
    log.debug("createObject(token=" + token + ", props=" + JSON.stringify(props) + ")");

    api(token, this.endpoint, "POST", props, function(error, responseBody) {
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
 * @callback Annotation~createAnnotationObject(callback)
 * @param {?Error} err - {@link null} or an object describing an exception that occured during execution
 * @param {?string} id - the ID assigned to the object after being inserted into the repository
 * @desc
 * Called after a new object has been added to the repository
 */

/**
 * Retrieve an Annotation from the repository database by its type and ID
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} id - ID of the Object to retrieve from the repository
 * @param {function} callback -
 * [A callback function called after the API request was finalized]{@link Annotation~getAnnotationObjectByID(callback)}
 */
Annotation.prototype.getAnnotationObjectByID = function(token, id, callback) {
    log.debug("getObjectByID(token=" + token + ", id=" + id + ")");

    var objectURL = this.getObjectURL(id);
    api(token, objectURL, "GET", null, callback);
};
/**
 * @callback Annotation~getObjectByID(callback)
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
 * [A callback function called after the API request was finalized]{@link Annotation~updateAnnotation(callback)}
 */
Annotation.prototype.updateAnnotation = function(token, id, props, callback) {
    log.debug("updateObject(token=" + token + ", id=" +
        id + ", props=" + JSON.stringify(props) + ")");

    var objectURL = this.getObjectURL(id);
    api(token, objectURL, "PUT", props, callback);
};
/**
 * @callback Annotation~updateAnnotation(callback)
 *
 * @param {?Error} err - {@link null} or an object describing an exception that occurred during execution
 * @param {?Object} responseBody - A new object returned from the repository with the new properties
 *
 * @desc
 * Called once response has been retrieved for the query
 */
/**
 * Find all Annotation matching {@link query} of a {@link type} in the repository
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {(Object|function|String[])} query - Filter attributes to apply to repository search
 * @param {bool} includeDetails - Flag if or if not to return full object from query
 * @param {function} callback -
 * [A callback function called after the API request was finalized]{@link Annotation~getAnnotationObjectsList(callback)}
 */
Annotation.prototype.getAnnotationObjectsList = function(token, query, callback) {
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

  api(token, queryURL, "GET", null, callback);
};
/**
 * @callback Annotation~getAnnotationObjectsList(callback)
 *
 * @param {?Error} err - {@link null} or an object describing an exception that occured during execution
 * @param {?Annotation[]} responseBody - A collection of Annotation matching the queried repository type Annotation
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
 * [A callback function called after the API request was finalized]{@link Annotation~deleteObject(callback)}
 */
Annotation.prototype.deleteAnnotationObject = function(token, id, callback) {
    log.debug("deleteAnnotationObject(token=" + token + ",  id=" + id + ")");

    var objectURL = this.getObjectURL(id);
    api(token, objectURL, "DELETE", null, callback);
};
/**
 * @callback Annotation~deleteAnnotationObject(callback)
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
Annotation.prototype.getObjectURL = function(id) {
    return this.endpoint + "/" + id;
};

module.exports = Annotation;
