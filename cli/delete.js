"use strict";

//
// Imports
//
var log = require("../lib/util/log");
var cmdCore = require("./core");
var fs = require("fs");

module.exports = function(type, id, options) {
    cmdCore.init(options);

    cmdCore.connectToRepository(options, function(err, repo) {
        cmdCore.handleError(err);

        repo.getObjectByID(type, id, function(err, result) {
            cmdCore.handleError(err);

            repo.deleteObject(type, id, function(err, result) {
                cmdCore.handleError(err);

                log.info("Object of type: " + type + " with id: " + id + "successfully deleted!");
                process.exit(0);
            });
        });
    });
};
