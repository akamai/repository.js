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
        repo.getObjectByID(type, id, function(err, result) {
            if (err != null) {
                log.error(err.message);
                process.exit(1);
            }
            repo.deleteObject(type, id, function(err, result) {
                if (err != null) {
                    log.error(err.message);
                    process.exit(1);
                }
                log.info("Object of type: " + type + " with id: " + id + "successfully deleted!");
                process.exit(0);
            });
        });
    });
};
