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

/**
 * @memberof CLI.core
 * Initializes the command-line interface
 *
 * @returns {Program} Program
 */
exports.program = function() {
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

    // commands
    program.command("query <type> [<params>]")
        .description("query for objects by type with optional parameters (comma separated)")
        .action(require("./query.js"));

    program.command("delete <type> <id>")
        .description("delete objects")
        .action(require("./delete.js"));

    program.command("update <type> <id> [file]")
        .description("Update an object in the repository based on the JSON formatted data in a file")
        .action(require("./update.js"));

    program.command("create [file]")
        .description("Create a new object based on the JSON data in <file>")
        .action(require("./create.js"));

    return program;
}
