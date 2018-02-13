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
    .option("-T, --apitoken <apitoken>", "SSO API Token")
    .option("-t, --tenant <tenant>", "Tenant name")
    .option("-r, --repository <url>", "Repository URL")
    .option("-j, --json", "Output as JSON")
    .option("-o, --output <file>", "Output file")
    .option("-v, --verbose", "Verbose debugging")
    .option("-a, --auth <file>", "auth.json file containing credentials")
    .option("-d, --details <boolean>", "Enable/Disable retrieving full object details")
    .option("-i, --stdin", "Use STDIN if file is required");

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
    .description("Create a new timeline object based on the JSON data in <file>")
    .action(require("./create.js"));

exports.program = program;
