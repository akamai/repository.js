"use strict";

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
module.exports = function(type, id, file, options) {
    cmdCore.init(options);

    var fullPath = path.resolve(file);
    var jsonObject;

    try {
        fs.existsSync(fullPath);
        jsonObject = require(fullPath);
    }
    catch(exception) {
        cmdCore.handleError(exception);
        process.exit(1);
    }

    cmdCore.connectToRepository(options, function(connectError, repo) {
        cmdCore.handleError(connectError);

        repo.objectExists(type, id, function(existsError, exists) {
            cmdCore.handleError(existsError);

            if (exists) {
                repo.updateObject(type, id, jsonObject, function(updateError, result) {
                    cmdCore.handleError(updateError);
                    log.debug(JSON.stringify(result, null, true));
                    log.info("Update was successful! New Object:");
                    var object = result.objects[0];
                    log.info("ID: " + object.id);
                    log.info("Name: " + object.name);
                    log.info("New values: " + JSON.stringify(jsonObject));
                });
            } else {
                cmdCore.handleError(new Error("Object of type: " + type + " and id: " + id + " could not be found. Exiting..."));
            }
        });
    });
};
