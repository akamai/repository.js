"use strict";

//
// Imports
//
var log = require("../lib/util/log");
var cmdCore = require("./core");
var fs = require("fs");

module.exports = function(id, options) {
    cmdCore.init(options);

    cmdCore.connectToRepository(options, function(err, timeline) {
        cmdCore.handleError(err);

        timeline.getTimelineObjectByID(id, function(err, result) {
            cmdCore.handleError(err);

            timeline.deleteTimelineObject(id, function(err, result) {
                cmdCore.handleError(err);

                log.info("Timeline Object with id: " + id + " successfully deleted!");
                process.exit(0);
            });
        });
    });
};
