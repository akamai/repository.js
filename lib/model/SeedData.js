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
 * @param serviceUrl {String} - API endpoint URL
 * @return {SeedData} New instance of the SeedData class
 */
function SeedData(serviceUrl) {
    this.endpoint = serviceUrl + "/SeedData";
}

/**
 * Reads SeedData object from the repository with the ID passed in and returns it in the callback passed in
 *
 * @param token {String} - API-Auth token retrieved witrh {@link Tokens}
 * @param id {String} - Repository ID of the SeedData object
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
 * @param err {Error} - {@link null} or an Error object returned by the request
 * @param responseBody {(String|Object)} - String of textual data from the response of a POJO from the JSON data
 */

/**
 * Append data to the given SeedData object in the database
 *
 * @param token {String} - API-Auth token retrieved with {@link Tokens}
 * @param id {String} - ID of the Repository Object
 * @param content {String} - Content to be appended to the SeedData object
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
 * @param err {Error} - {@link null} or an objecrt describing an exception that occured during execution
 * @param responseBody {String} - Empty String
 */

/**
 * Truncate the given SeedData Object matching the id in the repository database
 *
 * @param token {String} - API-Auth token retrieved with {@link Tokens}
 * @param id {String} - ID of the Repository Object
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
 * @param err {Error} - {@link null} or an objecrt describing an exception that occured during execution
 * @param responseBody {String} - Empty String
 */

/**
 *
 */
SeedData.prototype.getSeedDataURL = function(id) {
    return this.endpoint + "/" + id;
};

module.exports = SeedData;
