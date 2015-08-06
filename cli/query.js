"use strict";

//
// Imports
//
var log = require("../lib/util/log");
var cmdCore = require("./core");
var fs = require("fs");

//
// Action
//
module.exports = function(type, options) {
    cmdCore.init(options);

    cmdCore.connectToRepository(options, function(err, repo) {
        repo.queryObjects(type, {}, function(err, data) {
            if (options.parent.output) {
                fs.writeFileSync(options.parent.output, JSON.stringify(data));
            } else {
                log.info(data);
            }
        });
    });
};
