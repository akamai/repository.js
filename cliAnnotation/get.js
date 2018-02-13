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
            
            log.info("Annotation Object with id: " + id + " successfully found!");
            process.exit(0);
           
        });
    });
};
