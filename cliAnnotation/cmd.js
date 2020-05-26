"use strict";

/**
 * @namespace cmd
 *
 * @desc
 * [Commander]{@link https://www.npmjs.com/package/commander} pre-populated with the default flags use this to
 * setup your commandline application instance if you choose to extend the repository API commandline
 *
 * @tutorial CommandLineExtending
 */

var program = require("commander");
var path = require("path");
var fs = require("fs");

program
    .version(JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf-8")).version)
    .option("-u, --username <username>", "User name")
    .option("-p, --password <password>", "Password")
    .option("-T, --apiToken <apiToken>", "SSO API Token")
    .option("-t, --tenant <tenant>", "Tenant name")
    .option("-r, --repository <url>", "Repository URL")
    .option("-j, --json", "Output as JSON")
    .option("-o, --output <file>", "Output file")
    .option("-v, --verbose", "Verbose debugging")
    .option("-a, --auth <file>", "auth.json file containing credentials")
    .option("-d, --details <boolean>", "Enable/Disable retrieving full object details")
    .option("-i, --stdin", "Use STDIN if file is required");

program.on("--help", function() {
    console.log("  \n  Generate test data parameters:");
    console.log("");
    console.log("    $ testdata-gen --help");
    console.log("");
});

program.parse(process.argv);
if (process.argv.indexOf("testdata-gen") > -1) {
    console.log(" \n  Optional parameters (comma separated)\n");
    console.log("   count          count=     <number>                  Number timeline objects to be created");
    console.log("   domainIds      domainId=  <domain ids>              Domain id");
    console.log("   start          start=     <11234564512121>          Annonation start time in miliseconds");
    console.log("   end            end=       <11234564512121>          Annotation end time in milisecond");
    console.log("   type           type=      <'USER_ENTERED', 'MP_ALERT', or 'DIMENSION_EXPLOSION'>" +
        "          The type of annotation object you want to be created");
    console.log(" \n");
}

// commands
program.command("query [<params>]")
    .description("query of timeline objects with optional parameters (comma separated)")
    .action(require("./query.js"));

program.command("delete <id>")
    .description("delete objects")
    .action(require("./delete.js"));

program.command("get <id>")
    .description("get timeline object by id")
    .action(require("./get.js"));

program.command("create [file]")
    .description("Create a new annotation object based on the JSON data in <file>")
    .action(require("./create.js"));

program.command("update <id> [file]")
    .description("Update an annotation object in the repository based on the JSON formatted data in a file")
    .action(require("./update.js"));

program.command("testdata [<params>]")
    .description("Create a new object with optional parameters (comma separated)")
    .action(require("./testdata.js"));

exports.program = program;
