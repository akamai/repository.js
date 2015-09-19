"use strict";
var fs = require("fs");
var path = require("path");
var parseXMLString = require("xml2js").parseString;
var Builder = require("xml2js").Builder;

var log = require("../lib/util/log");
var cmdCore = require("./core");

module.exports = function(filePath, options) {
    cmdCore.init(options);
    // boomerang-1.0.1442662947.xml
    var pathObject = path.parse(filePath);

    fs.stat(filePath, function(err, stat) {
        checkError(err, filePath);
        cmdCore.connectToRepository(options, function(err, repo) {
            checkError(err);

            fs.readFile(filePath, function(err, fileBuffer) {
                checkError(err);

                var xmldata = fileBuffer.toString();
                parseXMLString(xmldata, {}, function (err, result) {
                    checkError(err);
                    repo.createObject(buildBoomrBody(result), function(err, result) {
                        checkError(err);
                        console.log(result);
                    });
                });
            });
        });
    });
};

function checkError(err, option) {
    if (err != null) {
        switch (err.code) {
        case "ENOENT":
            log.error("No such file or Directory: [" + option + "]");
            process.exit(1);
            break;
        default:
            if (err.name == "APIError") {
                log.error(err.message);
                process.exit(1);
            }
            log.error("An Unknown Error occured!");
            process.exit(1);
            break;
        }
    }
}

function buildBoomrBody (result) {
    var objectData = result["rp:ObjectSet"].Object[0];

    var xmldec = objectData.Body[0].Boomerang[0]["$"];
    xmldec.encoding = "UTF-8";

    var builder = new Builder({headless: true, renderOpts: {pretty: false}, rootName: "Boomerang", xmldec: xmldec});

    var body = {
        "$": {
            xmlns: xmldec.xmlns
        },
        Minified: objectData.Body[0].Boomerang[0].Minified,
        Debug: objectData.Body[0].Boomerang[0].Debug
    };

    return {
        type: objectData["$"].type,
        name: objectData["$"].name,
        schemaVersion: objectData["$"].schemaVersion,
        description: objectData["$"].name,
        body: builder.buildObject(body),
        attributes: [{
            name: "version",
            value: objectData.Attributes[0].Attribute[0].Value[0]
        }]
    };
}
