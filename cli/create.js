"use strict";

/**
 * @memberof CLI
 * @desc
 * Calls to repository to query for Objects are done through this sub-command
 */

//
// Imports
//
var log = require("../lib/util/log");
var cmdCore = require("./core");
var fs = require("fs");
var path = require("path");
//
// Action
//
module.exports = function(file, options) {
    cmdCore.init(options);

    var filePath = path.resolve(file);

    fs.stat(filePath, function(err, stat) {
        cmdCore.handleError(err);

        if (stat.isFile()) {

            var filestr = fs.readFileSync(filePath, 'utf8');
            var data;

            try {
                data = JSON.parse(filestr);
            }
            catch(err) {
                cmdCore.handleError(err);
            }

            log.debug(data);

            cmdCore.connectToRepository(options, function(err, repo) {
                cmdCore.handleError(err);

                repo.createObject(data, function(err, id) {
                    cmdCore.handleError(err);

                    log.info("New ID is: " + id, {id: id});
                });
            });
        }
    });
};
