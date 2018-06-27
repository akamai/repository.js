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
            try {
                data = JSON.parse(data);
            } catch (err) {
                cmdCore.handleError(err);
            }

            log.debug(data);

            create(options, data);
        });
    } else {
        var filePath = path.resolve(file);
        fs.stat(filePath, function(err, stat) {
            cmdCore.handleError(err);

            if (stat.isFile()) {
                var filestr = fs.readFileSync(filePath, "utf8");
                var data;

                try {
                    data = JSON.parse(filestr);
                } catch (err) {
                    cmdCore.handleError(err);
                }

                log.debug(data);

                create(options, data);
            }
        });
    }
};

function create(options, data) {
    cmdCore.connectToRepository(options, function(err, annotation) {
        cmdCore.handleError(err);

        annotation.createAnnotationObject(data, function(err, id) {
            cmdCore.handleError(err);

            log.log("info", "New Annotation Object ID is: " + id, { id: id });
            process.exit(0);
        });
    });
}
