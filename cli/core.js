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

var log = require("../lib/util/log");
var constants = require("../lib/constants");
var SOASTA = require("../lib/model/Repository.js");

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

    if (options && options.parent && typeof options.parent.json === "undefined") {
        log.transports.console.json =  false;
    } else {
        log.transports.console.json =  true;
    }

    if (options && options.parent && options.parent.verbose) {
        log.transports.console.level = "debug";
    }

    if (fs.existsSync("auth.json")) {
        // read in auth info
        var authContents = fs.readFileSync("auth.json", "utf-8");
        var auth = JSON.parse(authContents);

        // use auth contents as fallback
        options.parent = _.merge({}, auth, options.parent);
    }

    // use defaults for repository
    if (!options.parent.repository) {
        options.parent.repository = constants.REPOSITORY_URL;
    }

    // ensure username and password have been specified
    if (!options.parent.username) {
        log.error("--username (-u) is required");
        process.exit(1);
    }

    if (!options.parent.password) {
        log.error("--password (-p) is required");
        process.exit(1);
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
    repo.connect(options.parent.tenant, options.parent.username, options.parent.password, function(err) {
        return callback && callback(err, repo);
    });
}

/**
 * If a none falsy value is passed in use that to log an error to console and exit
 *
 * @param {?Error} error - Error object or null
 */
exports.handleError = function (err) {
    if (err) {
        log.error(err.message);
        process.exit(1);
    }
}
