"use strict";

var log = require("../util/log");
var api = require("../util/api-stream");

function SeedData(serviceUrl) {
    this.endpoint = serviceUrl + "/SeedData";
}

SeedData.prototype.readSeedData = function(token, id, outStream, callback) {
    log.debug("readSeedData(token=" + token + ", id=" + id + ")");

    var seedDataURL = this.getSeedDataURL(id);
    api(token, seedDataURL, "GET", null, outStream, callback);
};

SeedData.prototype.appendSeedData = function(token, id, content, callback) {
    log.debug("appendSeedData(token=" + token + ", id=" + id + ", content=" + content + ")");

    var seedDataURL = this.getSeedDataURL(id);
    api(token, seedDataURL, "POST", content, null, callback);
};

SeedData.prototype.truncateSeedData = function(token, id, callback) {
    log.debug("truncateSeedData(token=" + token + ", id=" + id + ")");

    var seedDataURL = this.getSeedDataURL(id);
    api(token, seedDataURL, "DELETE", null, null, callback);
};

SeedData.prototype.getSeedDataURL = function(id) {
    return this.endpoint + "/" + id;
};

module.exports = SeedData;
