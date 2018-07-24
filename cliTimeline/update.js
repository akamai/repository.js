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
    cmdCore.connectToRepository(options, function(connectError, timeline) {
        cmdCore.handleError(connectError);
        timeline.timelineObjectExists(id, function(existsError, exists) {
            cmdCore.handleError(existsError);

            if (exists) {
                timeline.updateTimelineObject(id, jsonObject, function(updateError, timelineUpdated) {
                    cmdCore.handleError(updateError);
                    log.debug(JSON.stringify(timelineUpdated, null, true));
                    log.info("Update was successful!");

                    if (timelineUpdated) {
                        log.info("New Object:");
                        log.log("info", "ID: " + timelineUpdated.id, { id: timelineUpdated.id });
                        log.log("info", "Type: " + timelineUpdated.title, { title: timelineUpdated.TimelineItemType });
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
