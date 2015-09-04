"use strict";

var log = require("../util/log");
var api = require("../util/api");

/**
 * @class SeedData
 * @desc
 * SeedData is a blob of data corresponding to an [Object]{@link Objects} in the repository database.
 * Use this class to interact with SeedData
 */

/**
 * @constructor SeedData
 *
 * @param {string} serviceUrl - API endpoint URL
 * @return {SeedData} New instance of the SeedData class
 */
function SeedData(serviceUrl) {
    this.endpoint = serviceUrl + "/SeedData";
}

/**
 * Reads the content of the specified SeedData object from the repository with the ID passed in and returns it in the callback passed in
 *
 * @param {string} token - API-Auth token retrieved witrh {@link Tokens}
 * @param {string} id - Repository ID of the SeedData object
 * @param {SeedData~readSeedData(callback)} callback - called once the API returned a result for the SeedData request
 */
SeedData.prototype.readSeedData = function(token, id, callback) {
    log.debug("readSeedData(token=" + token + ", id=" + id + ")");

    var seedDataURL = this.getSeedDataURL(id);
    api(token, seedDataURL, "GET", null, callback);
};
/**
 * @callback SeedData~readSeedData(callback)
 *
 * @param {?Error} err - {@link null} or an Error object returned by the request
 * @param {?(string|Object)} responseBody - the SeedData rows in CSV form
 */

/**
 * Append data to the given SeedData object in the database
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} id - ID of the Repository Object
 * @param {string} content - Content to be appended to the SeedData object, in CSV form
 * @param {SeedData~appendSeedData(callback)} callback - A callback function called after the API request was finalized
 */
SeedData.prototype.appendSeedData = function(token, id, content, callback) {
    log.debug("appendSeedData(token=" + token + ", id=" + id + ", content=" + content + ")");

    var seedDataURL = this.getSeedDataURL(id);
    api(token, seedDataURL, "POST", content, callback);
};
/**
 * @callback SeedData~appendSeedData(callback) callback
 *
 * @param {?Error} err - {@link null} or an objecrt describing an exception that occured during execution
 * @param {?string} responseBody - Empty String
 */

/**
 * Truncate the given SeedData Object matching the id in the repository database
 *
 * @param {string} token - API-Auth token retrieved with {@link Tokens}
 * @param {string} id - ID of the Repository Object
 * @param {SeedData~truncateSeedData(callback)} callback - A callback function called after the API request was finalized
 */
SeedData.prototype.truncateSeedData = function(token, id, callback) {
    log.debug("truncateSeedData(token=" + token + ", id=" + id + ")");

    var seedDataURL = this.getSeedDataURL(id);
    api(token, seedDataURL, "DELETE", null, callback);
};
/**
 * @callback SeedData~truncateSeedData(callback) callback
 *
 * @param {?Error} err - {@link null} or an objecrt describing an exception that occured during execution
 * @param {?string} responseBody - Empty String
 */

/**
 * Build the data URL for a SeedData element in the repository
 *
 * @param {string} id - The ID of the SeedData in the Repository database
 *
 * @returns {string} The URL of the SeedData
 */
SeedData.prototype.getSeedDataURL = function(id) {
    return this.endpoint + "/" + id;
};

module.exports = SeedData;
