"use strict";

/**
 * @namespace CLI
 * @name core
 * @desc
 * CLI Namespace and commands underneath it correspond to commandline interface.
 * You can use these commands to run repository.js from the commandline
 */

//
// Imports
//
var fs = require("fs");
var _ = require("lodash");
var winston = require("winston");

var log = require("../lib/util/log");
var constants = require("../lib/constants");
var SOASTA = require("../lib/model/SOASTA.js");

//
// Exports
//
/**
 * @memberof CLI.core
 * Initializes the command-line interface
 *
 * @param {object} options Options
 */
exports.init = function(options) {
    var authJsonPath = "auth.json";

    if (options && options.parent && typeof options.parent.json === "undefined") {
        log.format = winston.format.cli();
    } else {
        log.format = winston.format.json();
    }

    if (options && options.parent && options.parent.verbose) {
        log.transports.console.level = "debug";
    }

    if (options && options.parent && options.parent.auth) {
        authJsonPath = options.parent.auth;
    }

    if (fs.existsSync(authJsonPath)) {
        // read in auth info
        var authContents = fs.readFileSync(authJsonPath, "utf-8");
        var auth = JSON.parse(authContents);

        // use auth contents as fallback
        options.parent = _.merge({}, auth, options.parent);
    }

    // use defaults for repository
    if (!options.parent.repository) {
        options.parent.repository = constants.REPOSITORY_URL;
    }

    if (!options.parent.apiToken) {
        // ensure username and password have been specified
        if (!options.parent.username) {
            log.error("--username (-u) is required");
            process.exit(1);
        }

        if (!options.parent.password) {
            log.error("--password (-p) is required");
            process.exit(1);
        }
    }

};

/**
 * Connects to the SOASTA repository and return when Connected
 *
 * @param {Object} options Options
 * @param {function(err, repo)} callback Callback
 */
exports.connectToRepository = function(options, callback) {
    var repo = new SOASTA.Repository(options.parent.repository);
    var annotation = new SOASTA.Annotation(options.parent.repository);
    if (options.parent.apiToken) {
        annotation.connectByApiToken(options.parent.tenantName || null, options.parent.apiToken, function(err) {
            return callback && callback(err, annotation);
        });
    } else {
        repo.connect(options.parent.tenant, options.parent.username, options.parent.password, function(err, token) {
            annotation.setToken(token);
            return callback && callback(err, annotation);
        });
    }
}

/**
 * If a none falsy value is passed in use that to log an error to console and exit
 *
 * @param {?Error} err - Error object or null
 */
exports.handleError = function(err) {
    if (err) {
        log.error(err.message);
        process.exit(1);
    }
}
