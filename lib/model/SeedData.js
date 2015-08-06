"use strict";

var log = require("../util/log");
var api = require("../util/api");

function SeedData(serviceUrl) {
    this.endpoint = serviceUrl + "/SeedData";
}

SeedData.prototype.readSeedData = function(token, id, callback) {
    log.debug("readSeedData(token=" + token + ", id=" + id + ")");

    var seedDataURL = this.getSeedDataURL(id);
    api(token, seedDataURL, "GET", null, callback);
};

SeedData.prototype.appendSeedData = function(token, id, content, callback) {
    log.debug("appendSeedData(token=" + token + ", id=" + id + ", content=" + content + ")");

    var seedDataURL = this.getSeedDataURL(id);
    api(token, seedDataURL, "POST", content, callback);
};

SeedData.prototype.truncateSeedData = function(token, id, callback) {
    log.debug("truncateSeedData(token=" + token + ", id=" + id + ")");

    var seedDataURL = this.getSeedDataURL(id);
    api(token, seedDataURL, "DELETE", null, callback);
};

SeedData.prototype.getSeedDataURL = function(id) {
    return this.endpoint + "/" + id;
};

module.exports = SeedData;
