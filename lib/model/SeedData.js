"use strict";

var log = require("../util/log");
var apiJson = require("../util/api-json");
var apiStream = require("../util/api-stream");

function SeedData(serviceUrl) {
    this.endpoint = serviceUrl + "/SeedData";
}

SeedData.prototype.readSeedData = function(token, id, callback) {
    log.debug("readSeedData(token=" + token + ", id=" + id + ")");

    var seedDataURL = this.getSeedDataURL(id);
    apiJson(token, seedDataURL, "GET", null, callback);
};

SeedData.prototype.readSeedDataStream = function(token, id, outStream, callback) {
    log.debug("readSeedData(token=" + token + ", id=" + id + ")");

    var seedDataURL = this.getSeedDataURL(id);
    apiStream(token, seedDataURL, "GET", null, outStream, callback);
};

SeedData.prototype.appendSeedData = function(token, id, content, callback) {
    log.debug("appendSeedData(token=" + token + ", id=" + id + ", content=" + content + ")");

    var seedDataURL = this.getSeedDataURL(id);
    apiJson(token, seedDataURL, "POST", content, callback);
};

SeedData.prototype.appendSeedDataStream = function(token, id, inStream, callback) {
    log.debug("appendSeedData(token=" + token + ", id=" + id + ")");

    var seedDataURL = this.getSeedDataURL(id);
    apiStream(token, seedDataURL, "POST", inStream, null, callback);
};

SeedData.prototype.truncateSeedData = function(token, id, callback) {
    log.debug("truncateSeedData(token=" + token + ", id=" + id + ")");

    var seedDataURL = this.getSeedDataURL(id);
    apiStream(token, seedDataURL, "DELETE", null, null, callback);
};

SeedData.prototype.getSeedDataURL = function(id) {
    return this.endpoint + "/" + id;
};

module.exports = SeedData;
