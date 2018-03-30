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
module.exports = function(id, file, options) {
    cmdCore.init(options);

    var data = "";

    if (!file || options.parent.stdin) {
        process.stdin.setEncoding("utf8");

        process.stdin.on("readable", function() {
            var chunk = process.stdin.read();
            if (chunk !== null) {
                data += chunk;
            }
        });

        process.stdin.on("end", function() {
            log.debug(data);
            try {
                data = JSON.parse(data);
            } catch (err) {
                cmdCore.handleError(err);
            }

            update(options, id, data);
        });
    } else {
        var fullPath = path.resolve(file);
        var jsonObject;

        try {
            fs.existsSync(fullPath);
            jsonObject = require(fullPath);
        } catch (exception) {
            cmdCore.handleError(exception);
        }

        update(options, id, jsonObject);
    }

};

function update(options, id, jsonObject) {
    cmdCore.connectToRepository(options, function(connectError, annotation) {
        cmdCore.handleError(connectError);
        annotation.annotationObjectExists(id, function(existsError, exists) {
            cmdCore.handleError(existsError);

            if (exists) {
                annotation.updateAnnotation(id, jsonObject, function(updateError, annotationUpdated) {
                    cmdCore.handleError(updateError);
                    log.debug(JSON.stringify(annotationUpdated, null, true));
                    log.info("Update was successful!");

                    if (annotationUpdated) {
                        log.info("New Object:");
                        log.log("info", "ID: " + annotationUpdated.id, {id: annotationUpdated.id});
                        log.log("info", "Title: " + annotationUpdated.title, {title: annotationUpdated.title});
                        log.log("info", "New values: " + JSON.stringify(jsonObject), jsonObject);
                    }
                    process.exit(0);
                });
                
            } else {
                cmdCore.handleError(
                  new Error("Object of type: " + type + 
                    " and id: " + id + 
                    " could not be found. Exiting..."));
            }
        });
    });
}
