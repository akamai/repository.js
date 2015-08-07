"use strict";

var log = require("../util/log");

var SOASTA = {
    Repository: function Repository(serviceUrl) {

        var Tokens = require("./Tokens.js");
        var Objects = require("./Objects.js");
        var SeedData = require("./SeedData.js");

        var tokens = new Tokens(serviceUrl);
        var objects = new Objects(serviceUrl);
        var seedData = new SeedData(serviceUrl);

        var self = this;

        this.connect = function(tenantName, userName, password, callback) {
            // Wrap the provided callback with an in-between that extracts the token before proceeding.
            var wrapper = function(error, token) {
                log.debug("Got token: " + token + " or error: " + error);
                self.token = token;

                // We don't pass the token on, since the caller shouldn't need it for anything.
                if (callback) {
                    callback(error);
                }
            };

            // Call the Tokens API with our wrapper.
            tokens.connect(tenantName, userName, password, wrapper);
        };

        this.createObject = function(props, callback) {
            objects.createObject(self.token, props, callback);
        };

        this.getObjectByID = function(type, id, callback) {
            objects.getObjectByID(self.token, type, id, callback);
        };

        this.queryObjects = function(type, query, callback) {
            objects.queryObjects(self.token, type, query, callback);
        };

        this.updateObject = function(type, id, props, callback) {
            objects.updateObject(self.token, type, id, props, callback);
        };

        this.deleteObject = function(type, id, callback) {
            objects.deleteObject(self.token, type, id, callback);
        };

        this.readSeedData = function(id, callback) {
            seedData.readSeedData(self.token, id, callback);
        };

        this.appendSeedData = function(id, content, callback) {
            seedData.appendSeedData(self.token, id, content, callback);
        };

        this.truncateSeedData = function(id, callback) {
            seedData.truncateSeedData(self.token, id, callback);
        };

        this.disconnect = function(callback) {
            tokens.disconnect(self.token, callback);
        };

        this.asPromises = function(Promises) {
            var promisesRepository = new Repository(serviceUrl);

            for (var name in promisesRepository) {
                if (promisesRepository.hasOwnProperty(name)) {
                    var func = promisesRepository[name];

                    if (typeof func === "function" && name !== "asPromises") {
                        log.debug("Replacing function " + name + " with promise-ified version.");
                        func = Promises.denodeify(func);
                        promisesRepository[name] = func;
                    }
                }
            }

            return promisesRepository;
        };
    }
};

module.exports = SOASTA;
