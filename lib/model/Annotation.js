"use strict";
var denodeify = require("../util/promises").denodeify;
var log = require("../util/log");
var constants = require("../constants");

function Annotation(serviceUrl, sourceType) {
    var Tokens = require("./Tokens.js");
    var AnnotationObject = require("./AnnotationObject.js");

	// Fallback to production Service URL
	serviceUrl = serviceUrl || constants.ANNOTATION_URL;

    var tokens = new Tokens(serviceUrl + "/mpulse/api/annotations/v1", sourceType);
    var annotation = new AnnotationObject(serviceUrl, sourceType);

    var self = this;

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
        };

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
     * See [annotationObjectExists in Annotation]{@link Annotation#annotationObjectExists}.
     * The {@link token} will be passed on directly
     *
     * @param {number} id - ID of the object to check if it exists
     * @param {function} callback -
     * [Called after the API request was finalized]{@link Annotation~annotationObjectExists(callback)}
     */
    this.annotationObjectExists = function(id, callback) {
        annotation.annotationObjectExists(self.token, id, callback);
    };
    /**
     * See [getAnnotationObjectByID in Annotation]{@link Annotation#getAnnotationObjectByID}.
     * The {@link token} will be passed on directly
     *
     * @param {string} id - ID of the Object to retrieve from the repository
     * @param {function} callback -
     * [Called after the API request was finalized]{@link Annotation~getAnnotationObjectByID(callback)}
     */
    this.getAnnotationObjectByID = function(id, callback) {
        annotation.getAnnotationObjectByID(self.token, id, callback);
    };

    /**
     * See [getAnnotationObjectsList in AnnotationObject]{@link AnnotationObject#getAnnotationObjectsList}.
     * The {@link token} will be passed on directly
     *
     * @param {(AnnotationObject|function|String[])} query - Filter attributes to apply to repository search
     * @param {function} callback -
     * [Called after the API request was finalized]{@link AnnotationObject~getAnnotationObjectsList(callback)}
     */
    this.getAnnotationObjectsList = function(query, callback) {
        annotation.getAnnotationObjectsList(self.token, query, callback);
    };

    /**
     * See [createAnnotationObject in Annotation]{@link Annotation#createAnnotationObject}.
     * The {@link token} will be passed on directly
     *
     * @param {Annotation} props - A POJO describing object properties
     * @param {function} callback -
     * [Called after the API request was finalized]{@link Annotation~createAnnotationObject(callback)}
     */
    this.createAnnotationObject = function(props, callback) {
        annotation.createAnnotationObject(self.token, props, callback);
    };

    /**
     * See [deleteAnnotationObject in Objects]{@link Annotation#deleteAnotationObject}.
     * The {@link token} will be passed on directly
     *
     * @param {string} id - the id of the object to delete
     * @param {function} callback -
     * [Called after the API request was finalized]{@link Annotation~deleteAnnotationObject(callback)}
     */
    this.deleteAnnotationObject = function(id, callback) {
        annotation.deleteAnnotationObject(self.token, id, callback);
    };

    /**
     * See [updateAnnotation in Objects]{@link Annotation#updateAnnotation}.
     * The {@link token} will be passed on directly
     *
     * @param {string} id - the id of the object to delete
     * @param {Annotation} props - Properties that need to be updated
     * @param {function} callback -
     * [Called after the API request was finalized]{@link Annotation~updateAnnotation(callback)}
     */
    this.updateAnnotation = function(id, props, callback) {
        annotation.updateAnnotation(self.token, id, props, callback);
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
     * Wraps Annotation API wrapper instance into a promise based API instance. You may afterwards use all the
     * available calls in this
     * class in a Promise-style way.
     *
     * @returns {Repository} with Promise calling conventions
     */
    this.asPromises = function() {
        var promisesRepository = new Repository(serviceUrl);

        for (var name in promisesRepository) {
            if (promisesRepository.hasOwnProperty(name)) {
                var func = promisesRepository[name];

                if (typeof func === "function" && name !== "asPromises") {
                    log.debug("Replacing function " + name + " with promise-ified version.");
                    func = denodeify(func);
                    promisesRepository[name] = func;
                }
            }
        }

        return promisesRepository;
    };
}

module.exports = Annotation;
