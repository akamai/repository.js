"use strict";

//
// Imports
//
var log = require("../lib/util/log");
var cmdCore = require("./core");
var fs = require("fs");

module.exports = function(id, options) {
    cmdCore.init(options);

    cmdCore.connectToRepository(options, function(err, annotation) {
        cmdCore.handleError(err);

        annotation.getAnnotationObjectByID(id, function(err, result) {
            cmdCore.handleError(err);

            annotation.deleteAnnotationObject(id, function(err, result) {
                cmdCore.handleError(err);

                log.info("Annotation with id: " + id + " successfully deleted!");
                process.exit(0);
            });
        });
    });
};
