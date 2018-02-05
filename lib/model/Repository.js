"use strict";

var log = require("../util/log");

/**
 * @namespace SOASTA
 * @description
 * The SOASTA object inherits all functions from its member classes
 * This means that all functionality available in individual classes is also available from SOASTA via the
 * {@link Repository} class.
 */
var SOASTA = {

    /**
     * @constructor Repository
     * @memberof SOASTA
     *
     * @param {string} serviceUrl - API Endpoint URL
     */
    Repository: function Repository(serviceUrl) {

        var Tokens = require("./Tokens.js");
        var Objects = require("./Objects.js");
        var SeedData = require("./SeedData.js");
        var Timeline = require("./Timeline.js");
        var Annotation = require("./Annotation.js");

        var tokens = new Tokens(serviceUrl);
        var objects = new Objects(serviceUrl);
        var seedData = new SeedData(serviceUrl);
        var timeline = new Timeline(serviceUrl);
        var annotation = new Annotation(serviceUrl);
        
        var self = this;

        /**
         * Connect to the SOASTA repository and authenticate
         *
         * @param {string} tenantName The tenant we intend to logon to
         * @param {string} userName The username to authenticate with
         * @param {string} password The password to authenticate with
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Repository~connect(callback)}
         */
        this.connect = function(tenantName, userName, password, callback) {
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
         * @param {?Error} err either null or an Error object from the authentication
         *
         * @desc
         * Once Repository has tried to authenticate this callback will be called with the result of the authentication
         * attempt If it comes back with null the authentication has happend and the token will be stored in the
         * Repository instance and used from here on out as a header to inform the server that this client has
         * authenticated successfully
         */

        /**
         * Authenticate with the API endpoint to get the API-Auth token
         *
         * @param {string} tenantName - name of the tenant we want to access
         * @param {string} apiToken - the apiToken retrieved from mPulse UI
         * @param {function} callback -
         * [Called after the API Auth request was finalized]{@link Repository~connect(callback)}
         */
        this.connectByApiToken = function(tenantName, apiToken, callback) {
            var wrapper = function(error, token) {
                log.debug("Got token: " + token + " or error: " + error);
                self.token = token;

                if (callback) {
                    callback(error);
                }
            }

            tokens.connectByApiToken(tenantName, apiToken, wrapper);
        };

        /**
         * Use existing token (via cookie, most-likely) to initialize this object
         *
         * @param {string} token - the token retrieved from a cookie
         */
        this.setToken = function(token) {
            this.token = token;
        };

        /**
         * See [createObject in Objects]{@link Objects#createObject}. The {@link token} will be passed on directly
         *
         * @param {Object} props - A POJO describing object properties
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Objects~createObject(callback)}
         */
        this.createObject = function(props, callback) {
            objects.createObject(self.token, props, callback);
        };

        /**
         * See [getObjectByID in Objects]{@link Objects#getObjectByID}. The {@link token} will be passed on directly
         *
         * @param {string} type - A String describing the type of object to request
         * @param {string} id - ID of the Object to retrieve from the repository
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Objects~getObjectByID(callback)}
         */
        this.getObjectByID = function(type, id, callback) {
            objects.getObjectByID(self.token, type, id, callback);
        };

        /**
         * See [objectExists in Objects]{@link Objects#objectExists}. The {@link token} will be passed on directly
         *
         * @param {string} type - Type of repository object to search for
         * @param {number} id - ID of the object to check if it exists
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Objects~objectExists(callback)}
         */
        this.objectExists = function(type, id, callback) {
            objects.objectExists(self.token, type, id, callback);
        };

        /**
         * See [queryObjects in Objects]{@link Objects#queryObjects}. The {@link token} will be passed on directly
         *
         * @param {string} type - Type of repository object to search for
         * @param {(Object|function|String[])} query - Filter attributes to apply to repository search
         * @param {bool} includeDetails - Flag if or if not to return full object from query
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Objects~queryObjects(callback)}
         */
        this.queryObjects = function(type, query, includeDetails, callback) {
            objects.queryObjects(self.token, type, query, includeDetails, callback);
        };

        /**
         * See [updateObject in Objects]{@link Objects#updateObject}. The {@link token} will be passed on directly
         *
         * @param {string} type - Type of repository object to replace
         * @param {string} id - the id of the object to update
         * @param {Object} props - new properties for the object in the repository
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Objects~updateObject(callback})
         */
        this.updateObject = function(type, id, props, callback) {
            objects.updateObject(self.token, type, id, props, callback);
        };

        /**
         * See [deleteObject in Objects]{@link Objects#deleteObject}. The {@link token} will be passed on directly
         *
         * @param {string} type - Type of repository object to delete
         * @param {string} id - the id of the object to delete
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Objects~deleteObject(callback)}
         */
        this.deleteObject = function(type, id, callback) {
            objects.deleteObject(self.token, type, id, callback);
        };

        /**
         * See [readSeedData in SeedData]{@link SeedData#readSeedData}. The {@link token} will be passed on directly
         *
         * @param {string} id - Repository ID of the SeedData object
         * @param {function} callback -
         * [Called after the API request was finalized]{@link SeedData~readSeedData(callback)}
         */
        this.readSeedData = function(id, callback) {
            seedData.readSeedData(self.token, id, callback);
        };

        /**
         * Read data from the given SeedData object in the database as a stream
         *
         * @param {string} id - ID of the SeedData Object
         * @param {StreamReader} outStream - a {@link StreamReader} that will consume the opened HTTP connection
         * sending the SeedData down to the client
         * @param {function} callback -
         * [Called after the API request was finalized]{@link SeedData~appendSeedDataStream(callback)}
         */
        this.readSeedDataStream = function(id, outStream, callback) {
            seedData.readSeedDataStream(self.token, id, outStream, callback);
        };

        /**
         * See [appendSeedData in SeedData]{@link SeedData#appendSeedData}. The {@link token} will be passed on directly
         *
         * @param {string} id - ID of the Repository Object
         * @param {string} content - Content to be appended to the SeedData object
         * @param {function} callback -
         * [Called after the API request was finalized]{@link SeedData~appendSeedData(callback)}
         */
        this.appendSeedData = function(id, content, callback) {
            seedData.appendSeedData(self.token, id, content, callback);
        };

        /**
         * Read data from the given SeedData object in the database as a stream
         *
         * @param {string} id - ID of the SeedData Object
         * @param {StreamWriter} inStream - a {@link StreamWriter} that will write to the opened HTTP connection sending
         * the appended SeedData
         * @param {function} callback -
         * [Called after the API request was finalized]{@link SeedData~appendSeedDataStream(callback)}
         */
        this.appendSeedDataStream = function(id, inStream, callback) {
            seedData.appendSeedDataStream(self.token, id, inStream, callback);
        };

        /**
         * See [truncateSeedData in SeedData]{@link SeedData#truncateSeedData}. The {@link token}
         * will be passed on directly
         *
         * @param {string} id - ID of the Repository Object
         * @param {function} callback -
         * [Called after the API request was finalized]{@link SeedData~truncateSeedData(callback)}
         */
        this.truncateSeedData = function(id, callback) {
            seedData.truncateSeedData(self.token, id, callback);
        };

        /**
         * See [disconnect in Tokens]{@link Tokens#disconnect}. The {@link token} will be passed on directly
         *
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Tokens~disconnect(callback)}
         */
        this.disconnect = function(callback) {
            tokens.disconnect(self.token, callback);
        };

        
        /**
         * 
         * TIMELINE
         *  
         **/
        
        
        /**
         * See [getTimelineObjectByID in Timeline]{@link Timeline#getTimelineObjectByID}. The {@link token} will be passed on directly
         *
         * @param {string} id - ID of the Object to retrieve from the repository
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Timeline~getTimelineObjectByID(callback)}
         */
        this.getTimelineObjectByID = function(id, callback) {
            timeline.getTimelineObjectByID(self.token, id, callback);
        };
        
        /**
         * See [getTimelineObjectsList in Timeline]{@link Timeline#getTimelineObjectsList}. The {@link token} will be passed on directly
         *
         * @param {(Object|function|String[])} query - Filter attributes to apply to repository search
         * @param {bool} includeDetails - Flag if or if not to return full object from query
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Timeline~getTimelineObjectsList(callback)}
         */
        this.getTimelineObjectsList = function(url, callback) {
            timeline.getTimelineObjectsList(self.token, url, callback);
        };

        /**
         * See [createTimelineObject in Timeline]{@link Timeline#createObject}. The {@link token} will be passed on directly
         *
         * @param {Timeline} props - A POJO describing object properties
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Timeline~createTimelineObject(callback)}
         */
        this.createTimelineObject = function(props, callback) {
            timeline.createTimelineObject(self.token, props, callback);
        };
        
        
        /**
         * See [deleteTimelineObject in Timeline]{@link Timeline#deleteTimelineObject}. The {@link token} will be passed on directly
         *
         * @param {string} type - Type of repository object to delete
         * @param {string} id - the id of the object to delete
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Timeline~deleteTimelineObject(callback)}
         */
        this.deleteTimelineObject = function(id, callback) {
            timeline.deleteTimelineObject(self.token, id, callback);
        };
         
        /**
         * 
         * ANNOTATION
         *  
         **/
        
        /**
         * See [getAnnotationObjectByID in Annotation]{@link Annotation#getAnnotationObjectByID}. The {@link token} will be passed on directly
         *
         * @param {string} id - ID of the Object to retrieve from the repository
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Annotation~getAnnotationObjectByID(callback)}
         */
        this.getAnnotationObjectByID = function(id, callback) {
            annotation.getAnnotationObjectByID(self.token, id, callback);
        };
        
        /**
         * See [getAnnotationObjectsList in Annotation]{@link Annotation#getAnnotaionObjectsList}. The {@link token} will be passed on directly
         *
         * @param {(Object|function|String[])} query - Filter attributes to apply to repository search
         * @param {bool} includeDetails - Flag if or if not to return full object from query
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Annotation~getAnnotationObjectsList(callback)}
         */
        this.getAnnotationObjectsList = function(query, callback) {
          annotation.getAnnotationObjectsList(self.token, query, callback);
        };

        /**
         * See [createAnnotationObject in Annotation]{@link Annotation#createAnnotationObject}. The {@link token} will be passed on directly
         *
         * @param {Annotation} props - A POJO describing object properties
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Annotation~createAnnotationObject(callback)}
         */
        this.createAnnotationObject = function(props, callback) {
          annotation.createAnnotationObject(self.token, props, callback);
        };
        
        
        /**
         * See [deleteAnnotationObject in Objects]{@link Annotation#deleteTimelineObject}. The {@link token} will be passed on directly
         *
         * @param {string} type - Type of repository object to delete
         * @param {string} id - the id of the object to delete
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Annotation~deleteAnnotationObject(callback)}
         */
        this.deleteAnnotationObject = function(id, callback) {
          annotation.deleteAnnotationObject(self.token, id, callback);
        };
       
        /**
         * See [updateAnnotationObject in Objects]{@link Annotation#updateAnnotationObject}. The {@link token} will be passed on directly
         *
         * @param {string} type - Type of repository object to delete
         * @param {string} id - the id of the object to delete
         * * @param {Timeline} props - Properties that need to be updated
         * @param {function} callback -
         * [Called after the API request was finalized]{@link Annotation~updateAnnotationObject(callback)}
         */
        this.updateAnnotation = function(id, props, callback) {
          annotation.updateAnnotation(self.token, id, props, callback);
        };
        
        /**
         * Wraps Repository instance into a promise based API instance. You may afterwards use all the
         * available calls in this
         * class in a Promise-style way.
         *
         * @param {Object} Promises The Promise Object instance you wish to have Repository be wrapped into
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
