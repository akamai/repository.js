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

            update(options, type, id, data);
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

        update(options, type, id, jsonObject);
    }

};

function update(options, type, id, jsonObject) {
    cmdCore.connectToRepository(options, function(connectError, repo) {
        cmdCore.handleError(connectError);

        repo.objectExists(type, id, function(existsError, exists) {
            cmdCore.handleError(existsError);

            if (exists) {
                repo.updateObject(type, id, jsonObject, function(updateError, result) {
                    cmdCore.handleError(updateError);
                    log.debug(JSON.stringify(result, null, true));
                    log.info("Update was successful!");

                    if (result) {
                        log.info("New Object:");
                        var object = result.objects[0];
                        log.log("info", "ID: " + object.id, {id: object.id});
                        log.log("info", "Name: " + object.name, {name: object.name});
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
