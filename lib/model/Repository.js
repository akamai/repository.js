"use strict";

var log = require("../util/log");

/**
 * @namespace SOASTA
 * @description
 * The SOASTA object inherits all functions from its member classes
 * This means that all functionality available in individual classes is also available from SOASTA via the
 * {@link Respository} class.
 */
var SOASTA = {
    /**
     * @constructor Repository
     * @memberof SOASTA
     *
     * @param serviceUrl {String} - API Endpoint URL
     * @return {Repository} New instance of the Repository class
     */
    Repository: function Repository(serviceUrl) {

        var Tokens = require("./Tokens.js");
        var Objects = require("./Objects.js");
        var SeedData = require("./SeedData.js");

        var tokens = new Tokens(serviceUrl);
        var objects = new Objects(serviceUrl);
        var seedData = new SeedData(serviceUrl);

        var self = this;

	/**
	 * Connect to the SOASTA repository and authenticate
	 *
	 * @param tenantName {String} The tenant we intend to logon to
	 * @param userName {String} The username to authenticate with
	 * @param password {String} The password to authenticate with
	 * @param {Repository~connect(callback)} callback - Callback called once the the authentication has taken place
	 */
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
	/**
	 * @callback {Repository~connect(callback)}
	 *
	 * @param err {Error|null} either null or an Error object from the authentication
	 *
	 * @desc
	 * Once Repository has tried to authenticate this callback will be called with the result of the authentication attempt.
	 * If it comes back with null the authentication has happend and the token will be stored in the Repository instance 
	 * and used from here on out as a header to inform the server that this client has authenticated successfully
	 */

	/**
	 * @param props {Object} - A POJO describing object properties
	 * @param {Objects~createObject(callback)} callback - A callback called after the API request was finalized
	 *
	 * @desc
	 * See [createObject in Objects]{@link Objects#createObject}. The {@link token} will be passed on directly
	 */
        this.createObject = function(props, callback) {
            objects.createObject(self.token, props, callback);
        };

	/**
	 * @param type {String} - A String describing the type of object to request
	 * @param id {String} - ID of the Object to retrieve from the repository
	 * @param {Objects~getObjectByID(callback)} callback - A callback function called after the API request was finalized
	 *
	 * @desc
	 * See [getObjectByID in Objects]{@link Objects#getObjectByID}. The {@link token} will be passed on directly
	 */
        this.getObjectByID = function(type, id, callback) {
            objects.getObjectByID(self.token, type, id, callback);
        };

	/**
	 * @param type {String} - Type of repository object to search for
	 * @param query {Object} - POJO describing attributes to search for in the collection of repository objects
	 * @param {Objects~queryObjects(callback)} callback - A callback function called after the API request was finalized
	 *
	 * @desc
	 * See [queryObjects in Objects]{@link Objects#queryObjects}. The {@link token} will be passed on directly
	 */
        this.queryObjects = function(type, query, callback) {
            objects.queryObjects(self.token, type, query, callback);
        };

	/**
	 * @param type {String} - Type of repository object to replace
	 * @param id {String} - the id of the object to update
	 * @param props {Object} - new properties for the object in the repository
	 * @param {Objects~updateObject(callback)} callback - A callback function called after the API request was finalized
	 *
	 * @desc
	 * See [updateObject in Objects]{@link Objects#updateObject}. The {@link token} will be passed on directly
	 */
        this.updateObject = function(type, id, props, callback) {
            objects.updateObject(self.token, type, id, props, callback);
        };

	/**
	 * @param type {String} - Type of repository object to remove
	 * @param id {String} - the id of the object to update
	 * @param {Objects~deleteObject(callback)} callback - A callback function called after the API request was finalized
	 *
	 * @desc
	 * See [deleteObject in Objects]{@link Objects#deleteObject}. The {@link token} will be passed on directly
	 */
        this.deleteObject = function(type, id, callback) {
            objects.deleteObject(self.token, type, id, callback);
        };

	/**
	 * @param id {String} - Repository ID of the SeedData object
	 * @param {SeedData~readSeedData(callback)} callback - called once the API returned a result for the SeedData request
	 *
	 * @desc
	 * See [readSeedData in SeedData]{@link SeedData#readSeedData}. The {@link token} will be passed on directly
	 */
        this.readSeedData = function(id, callback) {
            seedData.readSeedData(self.token, id, callback);
        };

	/**
	 * @param id {String} - ID of the Repository Object
	 * @param content {String} - Content to be appended to the SeedData object
	 * @param {SeedData~appendSeedData(callback)} callback - A callback function called after the API request was finalized
	 *
	 * @desc
	 * See [appendSeedData in SeedData]{@link SeedData#appendSeedData}. The {@link token} will be passed on directly
	 */
        this.appendSeedData = function(id, content, callback) {
            seedData.appendSeedData(self.token, id, content, callback);
        };

	/**
	 * @param id {String} - ID of the Repository Object
	 * @param {SeedData~truncateSeedData(callback)} callback - A callback function called after the API request was finalized
	 *
	 * @desc
	 * See [truncateSeedData in SeedData]{@link SeedData#truncateSeedData}. The {@link token} will be passed on directly
	 */
        this.truncateSeedData = function(id, callback) {
            seedData.truncateSeedData(self.token, id, callback);
        };

	/*
	 * @param {Tokens~disconnect(callback)} callback - Callback called once the API de-authentication was executed*
	 *
	 * @desc
	 * See [disconnect in Tokens]{@link Tokens#disconnect}. The {@link token} will be passed on directly
	 */
        this.disconnect = function(callback) {
            tokens.disconnect(self.token, callback);
        };

	/**
	 * Wraps Repository instance into a promise based API instance. You may afterwards use all the available calls in this
	 * class in a Promise-style way.
	 *
	 * @param Promises {Object} The Promise Object instance you wish to have Repository be wrapped into
	 *
	 * @returns {Repository} with Promise calling conventions
	 */
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
