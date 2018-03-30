"use strict";

var log = require("../util/log");

function Timeline(serviceUrl) {
  
    var Tokens = require("./Tokens.js");
    var TimelineObject = require("./TimelineObject.js");

    var tokens = new Tokens(serviceUrl + "/mpulse/api/timeline/v1");
    var timeline = new TimelineObject(serviceUrl);
  
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
   * See [getTimelineObjectByID in Timeline]{@link Timeline#getTimelineObjectByID}. 
   * The {@link token} will be passed on directly
   *
   * @param {string} id - ID of the Object to retrieve from the repository
   * @param {function} callback -
   * [Called after the API request was finalized]{@link Timeline~getTimelineObjectByID(callback)}
   */
    this.getTimelineObjectByID = function(id, callback) {
        timeline.getTimelineObjectByID(self.token, id, callback);
    };
  
  /**
   * See [getTimelineObjectsList in Timeline]{@link Timeline#getTimelineObjectsList}. 
   * The {@link token} will be passed on directly
   *
   * @param {(Object|function|String[])} query - Filter attributes to apply to repository search
   * @param {function} callback -
   * [Called after the API request was finalized]{@link Timeline~getTimelineObjectsList(callback)}
   */
    this.getTimelineObjectsList = function(query, callback) {
        timeline.getTimelineObjectsList(self.token, query, callback);
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
   * See [deleteTimelineObject in Timeline]{@link Timeline#deleteTimelineObject}. 
   * The {@link token} will be passed on directly
   *
   * @param {string} id - the id of the object to delete
   * @param {function} callback -
   * [Called after the API request was finalized]{@link Timeline~deleteTimelineObject(callback)}
   */
    this.deleteTimelineObject = function(id, callback) {
        timeline.deleteTimelineObject(self.token, id, callback);
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

module.exports = Timeline;